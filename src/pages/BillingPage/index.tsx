import {
  Flex,
  Box,
  Tbody,
  Tr,
  Td,
  Table,
  TableContainer,
  Tooltip,
  Text,
  Thead,
  Th,
} from '@chakra-ui/react';
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import BigNumber from 'bignumber.js';
import 'src/styles/pages/BillingPage.scss';
import { BasePage } from 'src/layouts';
import {
  AppButton,
  AppCard,
  AppHeading,
  AppButtonLarge,
  AppDataTable,
  AppLoadingTable,
} from 'src/components';
import { useDispatch } from 'react-redux';
import {
  CheckedIcon,
  RadioNoCheckedIcon,
  RadioChecked,
  ArrowRightIcon,
  EditIcon,
  ListCardIcon,
  CircleCheckedIcon,
  CryptoIcon,
  ReloadIcon,
  ChevronRightIcon,
} from 'src/assets/icons';
import { isMobile } from 'react-device-detect';
import PartCheckout from './parts/PartCheckout';
import AppAlertWarning from 'src/components/AppAlertWarning';
import useUser from 'src/hooks/useUser';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useHistory } from 'react-router';
import PartPaymentInfo from './parts/PartPaymentInfo';
import ModalEditCreditCard from 'src/modals/ModalEditCreditCard';
import ModalCancelSubscription from 'src/modals/ModalCancelSubscription';
import PartTopUp from './parts/PartTopUp';
import { getUserPlan, getUserProfile } from 'src/store/user';
import { MetadataPlan } from 'src/store/metadata';
import useMetadata from 'src/hooks/useMetadata';
import ModalChangePaymentMethod from 'src/modals/ModalChangePaymentMethod';
import {
  formatCapitalize,
  formatTimestamp,
  getErrorMessage,
  scrollIntoElementById,
} from '../../utils/utils-helper';
import { ROUTES } from 'src/utils/common';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PartPlan from './parts/PartPlan';
import PartNotification, { NOTIFICATION_TYPE } from './parts/PartNotification';
import PartBilling from './parts/PartBilling';

export const PAYMENT_METHOD = {
  CARD: 'STRIPE',
  CRYPTO: 'BLOCKLENS',
};

enum STEPS {
  LIST,
  FORM,
  TOPUP,
  CHECKOUT,
}

export const paymentMethods = [
  {
    name: 'Credit Card',
    code: PAYMENT_METHOD.CARD,
  },
  {
    name: 'Crypto',
    code: PAYMENT_METHOD.CRYPTO,
  },
];

interface IPlanMobile {
  plan: MetadataPlan;
  planSelected: MetadataPlan;
  currentPlan: MetadataPlan;
  onSelect: (value: MetadataPlan) => void;
}

// const _renderPrice = (price: number | null) => {
//   if (price === 0) {
//     return 'Free';
//   }

//   return (
//     <>
//       ${price}
//       <span className="month-text">/mo</span>
//     </>
//   );
// };

// const PlanMobile: FC<IPlanMobile> = ({
//   plan,
//   currentPlan,
//   planSelected,
//   onSelect,
// }) => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const isCurrentPlan = plan.code === currentPlan.code;
//   const isActivePlan = planSelected.code === plan.code;
//   return (
//     <>
//       <Box
//         className={`${isOpen ? 'open' : ''} ${
//           isActivePlan ? 'active' : ''
//         } card-mobile plan-card`}
//       >
//         <Flex
//           justifyContent="space-between"
//           alignItems="center"
//           className="info"
//         >
//           <Flex
//             className="name-mobile"
//             alignItems={'center'}
//             onClick={() => onSelect(plan)}
//           >
//             {isActivePlan ? <RadioChecked /> : <RadioNoCheckedIcon />}
//             <Box ml={3}>{plan.code}</Box>

//             {isCurrentPlan && (
//               <Box ml={3} className={'box-current'}>
//                 Current Plan
//               </Box>
//             )}
//           </Flex>
//           <Box
//             className={isOpen ? 'icon-minus' : 'icon-plus'}
//             onClick={() => setIsOpen(!isOpen)}
//           />
//         </Flex>
//         <Box className={'plan-detail price'}>{_renderPrice(plan.price)}</Box>

//         {isOpen && (
//           <Box className="plan-detail">
//             <Flex alignItems={'center'} my={2}>
//               <CheckedIcon />
//               <Box ml={3}> {plan.capacity.project} apps </Box>
//             </Flex>
//             <Flex alignItems={'center'} my={2}>
//               <CheckedIcon />
//               <Box ml={3}> {plan.notificationLimitation} message/day </Box>
//             </Flex>
//             <Flex alignItems={'center'}>
//               <CheckedIcon />
//               <Box ml={3}> All supported chains</Box>
//             </Flex>
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// };

const BillingPage = () => {
  const { user } = useUser();
  const dispatch = useDispatch();

  const [paymentMethodSelected, setPaymentMethodSelected] = useState<
    string | any
  >(null);
  const [isOpenCancelSubscriptionModal, setIsOpenCancelSubscriptionModal] =
    useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<MetadataPlan>({} as any);
  const [isOpenEditCardModal, setIsOpenEditCardModal] =
    useState<boolean>(false);
  const [isOpenChangePayMethodModal, setIsOpenChangePayMethodModal] =
    useState<boolean>(false);
  const [isReloadingUserInfo, setIsReloadingUserInfo] =
    useState<boolean>(false);
  const [step, setStep] = useState<number>(STEPS.LIST);

  // useEffect(() => {
  //   setPaymentMethodSelected(user?.getActivePaymentMethod());
  // }, []);

  const paymentMethod = useMemo(
    () => user?.getActivePaymentMethod(),
    [user?.getActivePaymentMethod()],
  );

  // useEffect(() => {
  //   if (user) {
  //     setSelectedPlan(user.getPlan());
  //   }
  // }, [user?.getPlan()]);

  // useEffect(() => {
  //   const RELOAD_BALANCE_DURATION = 30;
  //   let reloadBalanceInterval: any = null;
  //   if (paymentMethod === PAYMENT_METHOD.CRYPTO) {
  //     reloadBalanceInterval = setInterval(() => {
  //       dispatch(getUserProfile());
  //     }, RELOAD_BALANCE_DURATION * 1000);
  //   }
  //   return () => {
  //     clearInterval(reloadBalanceInterval);
  //   };
  // }, [paymentMethod]);

  // const isSufficientBalance = useMemo(() => {
  //   if (!user || !selectedPlan) {
  //     return false;
  //   }
  //   return new BigNumber(user.getBalance()).isGreaterThanOrEqualTo(
  //     new BigNumber(selectedPlan.price),
  //   );
  // }, [user?.getBalance(), selectedPlan]);

  // const isCurrentPlan = new BigNumber(selectedPlan.price).isEqualTo(
  //   new BigNumber(user?.getPlan().price || 0),
  // );
  // const isDownGrade = new BigNumber(selectedPlan.price).isLessThan(
  //   new BigNumber(user?.getPlan().price || 0),
  // );

  // const _renderPlansDesktop = () => {
  //   const _renderBody = () => {
  //     return (
  //       <Tbody>
  //         {billingPlans?.map((plan: MetadataPlan, index: number) => {
  //           const isCurrentPlan = plan.code === user?.getPlan().code;
  //           const isActivePlan = selectedPlan.code === plan.code;
  //           return (
  //             <Tr
  //               key={index}
  //               className={`${isActivePlan ? 'active' : ''} tr-list`}
  //               onClick={() => setSelectedPlan(plan)}
  //             >
  //               <Td>
  //                 <Flex alignItems={'center'}>
  //                   {isActivePlan ? <RadioChecked /> : <RadioNoCheckedIcon />}
  //                   <Box ml={3} className="name-plan">
  //                     {plan.name.toLowerCase()}
  //                   </Box>

  //                   {isCurrentPlan && (
  //                     <Box ml={3} className={'box-current'}>
  //                       Current Plan
  //                     </Box>
  //                   )}
  //                 </Flex>
  //               </Td>
  //               <Td>
  //                 <Flex alignItems={'center'}>
  //                   <CheckedIcon />
  //                   <Box ml={3}> {plan.capacity.project} apps </Box>
  //                 </Flex>
  //               </Td>
  //               <Td>
  //                 <Flex alignItems={'center'}>
  //                   <CheckedIcon />
  //                   <Box ml={3}>
  //                     {' '}
  //                     {plan.notificationLimitation} messages/day{' '}
  //                   </Box>
  //                 </Flex>
  //               </Td>
  //               <Td>
  //                 <Flex alignItems={'center'}>
  //                   <CheckedIcon />
  //                   <Box ml={3}>All supported chains</Box>
  //                 </Flex>
  //               </Td>
  //               <Td>{_renderPrice(plan.price)}</Td>
  //             </Tr>
  //           );
  //         })}
  //       </Tbody>
  //     );
  //   };

  //   return (
  //     <TableContainer>
  //       <Table colorScheme="gray" className={'table-plan'}>
  //         {_renderBody()}
  //       </Table>
  //     </TableContainer>
  //   );
  // };

  // const _renderPlansMobile = () => {
  //   if (!user) {
  //     return null;
  //   }
  //   return (
  //     <Box className="list-card-mobile">
  //       {billingPlans?.map((plan: MetadataPlan, index: number) => {
  //         return (
  //           <PlanMobile
  //             plan={plan}
  //             key={index}
  //             currentPlan={user.getPlan()}
  //             planSelected={selectedPlan}
  //             onSelect={setSelectedPlan}
  //           />
  //         );
  //       })}
  //     </Box>
  //   );
  // };

  const onReloadUserInfo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReloadingUserInfo(true);
    await dispatch(getUserProfile());
    setIsReloadingUserInfo(false);
    toastSuccess({ message: 'Reload balance successfully!' });
  };

  // const _renderButtonUpdatePlan = () => {
  //   if (isCurrentPlan) return;
  //   const getTextButton = () => {
  //     if (isDownGrade) return 'Downgrade';
  //     return 'Upgrade';
  //   };

  //   return (
  //     <>
  //       <Flex
  //         justifyContent={isMobile ? 'center' : 'flex-end'}
  //         width={isMobile ? '100%' : 'auto'}
  //       >
  //         <AppButton
  //           width={isMobile ? '100%' : 'auto'}
  //           size="lg"
  //           mt={3}
  //           isDisabled={isCurrentPlan}
  //           onClick={onChangePlan}
  //         >
  //           {getTextButton()}
  //         </AppButton>
  //       </Flex>
  //     </>
  //   );
  // };

  // const _renderButton = () => {
  //   const isDisabled = selectedPlan.price === 0;
  //   return (
  //     <>
  //       <Flex justifyContent={isMobile ? 'center' : 'flex-end'}>
  //         <AppButton
  //           width={isMobile ? '100%' : 'auto'}
  //           size="lg"
  //           mt={isMobile ? 3 : 0}
  //           isDisabled={isDisabled}
  //           onClick={() => setStep(STEPS.FORM)}
  //         >
  //           Continue
  //         </AppButton>
  //       </Flex>
  //     </>
  //   );
  // };

  const onBackStep = () => setStep((prevState) => prevState - 1);

  const _renderContent = () => {
    switch (step) {
      case STEPS.LIST:
        return (
          <PartBilling
            onUpgradePlan={(plan) => {
              setSelectedPlan(plan);
              setStep(STEPS.CHECKOUT);
            }}
          />
        );
      // case STEPS.FORM:
      //   return (
      //     <PartPaymentInfo
      //       planSelected={selectedPlan}
      //       onBack={onBackStep}
      //       onNext={() => setStep(STEPS.CHECKOUT)}
      //       paymentMethod={paymentMethodSelected}
      //       setPaymentMethod={setPaymentMethodSelected}
      //     />
      //   );
      // case STEPS.TOPUP:
      //   return (
      //     <PartTopUp
      //       planSelected={selectedPlan}
      //       onBack={() => setStep(STEPS.LIST)}
      //     />
      //   );
      case STEPS.CHECKOUT:
        return (
          <PartCheckout
            planSelected={selectedPlan}
            paymentMethodCode={paymentMethod}
            onBack={
              user?.isPaymentMethodIntegrated()
                ? () => setStep(STEPS.LIST)
                : () => setStep(STEPS.FORM)
            }
          />
        );
      default:
        return null;
    }
  };

  // const _renderWarning = () => {
  //   if (isCurrentPlan || !user?.isPaymentMethodIntegrated()) {
  //     return null;
  //   }
  //   return (
  //     <AppAlertWarning>
  //       {isDownGrade
  //         ? 'Your current plan would still be usable until the end of the current billing period. New plan will be applied with the next billing period. Some apps might become inactive to match limit of the Downgraded plan (changable later).'
  //         : 'Your current plan will be terminated. New plan will be applied with billing period starting today.'}
  //     </AppAlertWarning>
  //   );
  // };

  return (
    <BasePage className="billing-page">
      <>{_renderContent()}</>
    </BasePage>
  );
};

export default BillingPage;
