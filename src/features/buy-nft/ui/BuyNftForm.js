import tw from 'twin.macro';
import 'styled-components/macro';
import { useForm } from 'react-hook-form';
import { useGate, useUnit } from 'effector-react';
import { buyNftModel } from '../model';
import { Input } from '../../../shared/ui-kit/components/misc/Input';
import { Button } from '../../../shared/ui-kit/components/misc/Buttons';
import { Select } from '../../../shared/ui-kit/components/misc/Select';
import { Label } from '../../../shared/ui-kit/components/misc/Label';
import { useMemo } from 'react';
import { collectionsModel } from '../../../entities/collections';
import { Toast } from '../../../shared/ui-kit/components/misc/Toast';
import { walletModel } from '../../../entities/wallet/model';
import { CHAIN_CONFIG } from '../../../shared/config';

const defaultValues = {
  currency: 'USDT',
  amount: 1
};

export const BuyNftForm = ({ nftAddress, className }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = useForm({ defaultValues });
  const approved = useUnit(buyNftModel.$approved);
  const allowancePending = useUnit(buyNftModel.allowanceFx.pending);
  const price = collectionsModel.usePriceDollar(nftAddress);
  const tokenId = collectionsModel.useTokenId(nftAddress);
  const amountLimit = collectionsModel.useAmountLimit(nftAddress);
  const mintErrorToast = useUnit(buyNftModel.$mintErrorToast);
  const isSupportedNetwork = useUnit(walletModel.$isSupportedNetwork);
  const available = (amountLimit.value ?? 0) - (tokenId.value ?? 0);
  const currency = watch('currency');
  const amount = watch('amount');
  const gateState = useMemo(() => ({ nftAddress, currency }), [nftAddress, currency]);
  useGate(buyNftModel.BuyNftGate, gateState);
  const fullPrice = Math.min(amount, available) * price?.value;
  const submitLabel = !isSupportedNetwork
    ? 'Switch network'
    : approved
    ? `Buy for ${fullPrice} ${currency}`
    : `Approve ${currency}`;
  const loading = allowancePending || isSubmitting;

  const onSubmit = ({ currency, amount }) => {
    if (!isSupportedNetwork) {
      return walletModel.switchNetworkFx({ chainId: CHAIN_CONFIG.id });
    }
    if (!approved) {
      return buyNftModel.approveFx({ nftAddress, currency }).catch(() => {});
    }
    return buyNftModel.mintFx({ nftAddress, currency, amount }).catch(() => {});
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      css={tw`grid gap-3 w-full max-w-[320px]`}
      className={className}
      autoComplete="off"
    >
      <div css={tw`grid gap-2 text-left`}>
        <Label>Amount</Label>
        <Input
          {...register('amount', { min: 1, max: 148 })}
          defaultValue={defaultValues.amount}
          disabled={loading}
          numeric
          disableDecimals
          onPaste={(event) => event.preventDefault()}
          pattern="[0-9]*"
          inputmode="numeric"
        />
      </div>
      <div css={tw`grid gap-2 text-left`}>
        <Label>Currency</Label>
        <Select {...register('currency')} defaultValue={defaultValues.currency} disabled={loading}>
          <Select.Option value="USDT">
            <div css={tw`flex items-center gap-2`}>
              <img src="/images/USDT.png" css={tw`w-[1em] h-[1em]`} />
              USDT
            </div>
          </Select.Option>
          <Select.Option value="USDC">
            <div css={tw`flex items-center gap-2`}>
              <img src="/images/USDC.png" css={tw`w-[1em] h-[1em]`} />
              USDC
            </div>
          </Select.Option>
        </Select>
      </div>
      <Button type="submit" css={tw`mt-3`} loading={loading}>
        {submitLabel}
      </Button>
      <Toast
        title="Error"
        open={!!mintErrorToast}
        duration={Infinity}
        onOpenChange={() => buyNftModel.closeMintErrorToast()}
      >
        {mintErrorToast}
      </Toast>
    </form>
  );
};
