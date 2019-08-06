import { Routes } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: './pages/home/home.module#HomeModule'
      },
      {
        path: 'dashboard',
        loadChildren: './pages/dashboard/dashboard-default/dashboard-default.module#DashboardDefaultModule'
      },
      // {
      //   path: 'fundtransfer',
      //   loadChildren: './pages/fundtransfer/fundtransfer.module#FundTransferModule'
      // },
      {
        path: 'master',
        loadChildren: './pages/master/master.module#MasterModule'
      },
      {
        path: 'billPayment',
        loadChildren: './pages/billPayment/billPayment.module#BillPaymentModule'
      },
      {
        path: 'products',
        loadChildren: './pages/products/product.module#ProductModule'
      },
      {
        path: 'statements',
        loadChildren: './pages/statement/statement.module#StatementModule'
      },
      {
        path: 'bbps',
        loadChildren: './pages/bbps/bbps.module#BbpsModule'
      },
      {
        path: 'insurance',
        loadChildren: './pages/insurance/insurance.module#InsuranceModule'
      },
      {
        path: 'bank',
        loadChildren: './pages/bank/bank.module#BankModule'
      },
      // {
      //   path: 'bankModal',
      //   loadChildren: './pages/checkBankModal/checkBankModal.module#CheckBankModalModule'
      // },
      {
        path: 'StatementOfTransaction',
        loadChildren: './pages/StatementOfTransaction/StatementOfTransaction.module#StatementOfTransactionModule'
      },
      {
        path: 'settings',
        loadChildren: './pages/settings/settings.module#SettingtModule'
      },
      {
        path: 'notifications',
        loadChildren: './pages/ui-elements/advance/notifications/notifications.module#NotificationsModule'
      }
    ]
  }, {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: './pages/authentication/authentication.module#AuthenticationModule'
      }
    ]
  }, {
    path: 'merchantRegistration',
    loadChildren: './pages/merchantRegistration/merchantRegistration.module#MerchantRegistrationModule'
  }

];
