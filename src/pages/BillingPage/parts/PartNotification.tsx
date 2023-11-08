import { Flex } from '@chakra-ui/react';
import { AppButton } from 'src/components';

export const NOTIFICATION_TYPE = {
  FAILED_RENEWAL: 'FAILED_RENEWAL',
  WARNING_DOWNGRADE: 'WARNING_DOWNGRADE',
  SUCCEEDED_DOWNGRADE: 'SUCCEEDED_DOWNGRADE',
};

interface INotification {
  variant?: typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];
}

const PartNotification: React.FC<INotification> = (props) => {
  const { variant } = props;

  const _renderContent = () => {
    switch (variant) {
      case NOTIFICATION_TYPE.FAILED_RENEWAL:
        return (
          <>
            <Flex>
              <span>
                Renewal of <b>Growth</b> plan is on hold due to lack of payment.
              </span>
            </Flex>
            <AppButton
              variant="no-effects"
              className="plan-notification__button plan-notification__button--notification"
            >
              Pay now
            </AppButton>
          </>
        );
      case NOTIFICATION_TYPE.WARNING_DOWNGRADE:
        return (
          <>
            <Flex>
              <span>
                Downgrading to <b>Growth</b> plan is on hold due to lack of
                payment.
              </span>
            </Flex>
            <Flex>
              <AppButton
                variant="no-effects"
                className="plan-notification__button plan-notification__button--notification"
              >
                Pay now
              </AppButton>
              <AppButton
                variant="no-effects"
                className="plan-notification__button plan-notification__button--warning"
              >
                Dismiss
              </AppButton>
            </Flex>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      className="plan-notification plan-notification--warning"
    >
      {_renderContent()}
    </Flex>
  );
};

export default PartNotification;
