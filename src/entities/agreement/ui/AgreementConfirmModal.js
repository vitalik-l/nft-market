import tw from 'twin.macro';
import 'styled-components/macro';
import { Modal } from '../../../shared/ui-kit/components/misc/Modal';
import { useTranslation } from 'react-i18next';
import { useUnit } from 'effector-react';
import { agreementModel } from '../model';
import { AgreementText } from './AgreementText';
import { Button } from '../../../shared/ui-kit/components/misc/Buttons';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export const AgreementConfirmModal = () => {
  const { t } = useTranslation();
  const isOpen = useUnit(agreementModel.$isOpen);
  const confirmed = useUnit(agreementModel.$confirmed);
  const [checked, setChecked] = useState(confirmed);

  return (
    <Modal title={t('User agreement')} open={isOpen} onClose={() => agreementModel.close()} css={tw`w-[800px]`}>
      <div>
        <div css={tw`p-[15px] shadow-[inset_0_-1px_5px_0_#ccc]`}>
          <AgreementText />
        </div>
        <div css={tw`p-[15px] mt-4 text-center`}>
          <div css={tw`flex items-center`}>
            <Checkbox.Root
              className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px] min-w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_1px_4px] outline-none shadow-primary-600 focus:outline-none"
              id="c1"
              checked={checked}
              onCheckedChange={setChecked}
            >
              <Checkbox.Indicator className="text-primary-600">
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label className="pl-[15px] text-[15px] leading-none" htmlFor="c1">
              {t('agreementConfirm')}
            </label>
          </div>
          <Button css={tw`mt-4`} disabled={!checked} onClick={() => agreementModel.confirm()}>
            {t('Proceed')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
