import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  short_label?: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

// Admin
let MENUITEMSAdmin = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'fundtransfer',
        short_label: 'F',
        name: 'Fund Transfer',
        type: 'link',
        icon: 'fas fa-exchange-alt'
      },
      {
        state: 'master',
        short_label: 'M',
        name: 'Masters',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'institutionUserMaster',
            name: 'Create User',
          },
          {
            state: 'institutesubmaster',
            name: 'Institute Sub Master',
          }
        ]
      },
      {
        state: 'billPayment',
        short_label: 'B',
        name: 'Transaction',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'receiveMoney',
            name: 'Receive Money'
          },
          {
            state: 'sendMoney',
            name: 'Send Money'
          },
        ]
      },
      {
        state: 'products',
        short_label: 'PO',
        name: 'Products',
        type: 'sub',
        icon: 'ti-view-list-alt',
        children: [
          {
            state: 'productMaster',
            name: 'Product Master',
          },
          {
            state: 'productSale',
            name: 'Product Sale',
          },
          {
            state: 'productTypeMaster',
            name: 'Product Type Master',
          }
        ]
      },

      {
        state: 'StatementOfTransaction',
        short_label: 'B',
        name: 'Statement Of Transaction',
        type: 'sub',
        icon: 'ti-stats-up',
        children: [
          {
            state: 'ClientWiseStatement',
            name: 'Client Wise Statement'
          },
          {
            state: 'InstitutionWiseState',
            name: 'Institution Wise Statement',
          },
          {
            state: 'SubInstitutionWiseState',
            name: 'Sub Institution Wise Statement'
          },

        ]
      },
      {
        state: 'statements',
        short_label: 'n',
        name: 'Statements',
        type: 'link',
        icon: 'ti-stats-up'
      },
      {
        state: 'insurance',
        short_label: 'in',
        name: 'Insurance',
        type: 'link',
        icon: 'ti-shield'
      },
        {
        state: 'bank',
        short_label: 'bn',
        name: 'Bank',
        type: 'link',
        icon: 'fa fa-university'
      }

    ],
  },
  {
    label: 'Settings',
    main: [
      {
        state: 'settings',
        short_label: 'M',
        name: 'Settings',
        type: 'sub',
        icon: 'ti-settings',
        children: [
          {
            state: 'changePassword',
            name: 'Change Password',
            // target: false
          },
          {
            state: 'setThumbDevice',
            name: 'Set Finger Print Device',
          },
          {
            state: 'profile',
            name: 'Profile',
          },
          {
            state: 'setBankDetails',
            name: 'Set Bank Details',
          }
        ]
      }
    ]
  },
 
];

// AdminBbps
let MENUITEMSAdminBbps = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'fundtransfer',
        short_label: 'F',
        name: 'Fund Transfer',
        type: 'link',
        icon: 'fas fa-exchange-alt'
      },
      {
        state: 'master',
        short_label: 'M',
        name: 'Masters',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'institutionUserMaster',
            name: 'Create User',
          },
          {
            state: 'institutesubmaster',
            name: 'Institute Sub Master',
          }
        ]
      },
      {
        state: 'billPayment',
        short_label: 'B',
        name: 'Transaction',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'receiveMoney',
            name: 'Receive Money'
          },
          {
            state: 'sendMoney',
            name: 'Send Money'
          },
        ]
      },
      {
        state: 'products',
        short_label: 'PO',
        name: 'Products',
        type: 'sub',
        icon: 'ti-view-list-alt',
        children: [
          {
            state: 'productMaster',
            name: 'Product Master',
          },
          {
            state: 'productSale',
            name: 'Product Sale',
          },
          {
            state: 'productTypeMaster',
            name: 'Product Type Master',
          }
        ]
      },

      {
        state: 'StatementOfTransaction',
        short_label: 'B',
        name: 'Statement Of Transaction',
        type: 'sub',
        icon: 'ti-stats-up',
        children: [
          {
            state: 'ClientWiseStatement',
            name: 'Client Wise Statement'
          },
          {
            state: 'InstitutionWiseState',
            name: 'Institution Wise Statement',
          },
          {
            state: 'SubInstitutionWiseState',
            name: 'Sub Institution Wise Statement'
          },

        ]
      },
      {
        state: 'statements',
        short_label: 'n',
        name: 'Statements',
        type: 'link',
        icon: 'ti-stats-up'
      },
      {
        state: 'bbps',
        short_label: 'bb',
        name: 'BBPS',
        type: 'link',
        icon: 'fas fa-handshake'
      }
      ,
      {
        state: 'insurance',
        short_label: 'in',
        name: 'Insurance',
        type: 'link',
        icon: 'ti-shield'
      },  {
        state: 'bank',
        short_label: 'bn',
        name: 'Bank',
        type: 'link',
        icon: 'fa fa-university'
      }
    ],
  },
  {
    label: 'Settings',
    main: [
      {
        state: 'settings',
        short_label: 'M',
        name: 'Settings',
        type: 'sub',
        icon: 'ti-settings',
        children: [
          {
            state: 'changePassword',
            name: 'Change Password',
            // target: false
          },
          {
            state: 'setThumbDevice',
            name: 'Set Finger Print Device',
          },
          {
            state: 'profile',
            name: 'Profile',
          },
          {
            state: 'setBankDetails',
            name: 'Set Bank Details',
          }
        ]
      }
    ]
  },

];
// AdminBank
let MENUITEMSAdminBank = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'fundtransfer',
        short_label: 'F',
        name: 'Fund Transfer',
        type: 'link',
        icon: 'fas fa-exchange-alt'
      },
      {
        state: 'master',
        short_label: 'M',
        name: 'Masters',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'institutionUserMaster',
            name: 'Create User',
          },
          {
            state: 'institutesubmaster',
            name: 'Institute Sub Master',
          }
        ]
      },
      {
        state: 'billPayment',
        short_label: 'B',
        name: 'Transaction',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'receiveMoney',
            name: 'Receive Money'
          },
          {
            state: 'sendMoney',
            name: 'Send Money'
          },
        ]
      },
      {
        state: 'products',
        short_label: 'PO',
        name: 'Products',
        type: 'sub',
        icon: 'ti-view-list-alt',
        children: [
          {
            state: 'productMaster',
            name: 'Product Master',
          },
          {
            state: 'productSale',
            name: 'Product Sale',
          },
          {
            state: 'productTypeMaster',
            name: 'Product Type Master',
          }
        ]
      },

      {
        state: 'StatementOfTransaction',
        short_label: 'B',
        name: 'Statement Of Transaction',
        type: 'sub',
        icon: 'ti-stats-up',
        children: [
          {
            state: 'ClientWiseStatement',
            name: 'Client Wise Statement'
          },
          {
            state: 'InstitutionWiseState',
            name: 'Institution Wise Statement',
          },
          {
            state: 'SubInstitutionWiseState',
            name: 'Sub Institution Wise Statement'
          },

        ]
      },
      {
        state: 'statements',
        short_label: 'n',
        name: 'Statements',
        type: 'link',
        icon: 'ti-stats-up'
      },
      {
        state: 'insurance',
        short_label: 'in',
        name: 'Insurance',
        type: 'link',
        icon: 'ti-shield'
      },  {
        state: 'bank',
        short_label: 'bn',
        name: 'Bank',
        type: 'link',
        icon: 'fa fa-university'
      }
    ],
  },
  {
    label: 'Settings',
    main: [
      {
        state: 'settings',
        short_label: 'M',
        name: 'Settings',
        type: 'sub',
        icon: 'ti-settings',
        children: [
          {
            state: 'changePassword',
            name: 'Change Password',
            // target: false
          },
          {
            state: 'setThumbDevice',
            name: 'Set Finger Print Device',
          },
          {
            state: 'profile',
            name: 'Profile',
          },
          {
            state: 'setBankDetails',
            name: 'Set Bank Details',
          }
        ]
      }
    ]
  },

];


// Super
let MENUITEMSSuper = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'master',
        short_label: 'M',
        name: 'Masters',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'institutionUserMaster',
            name: 'Create User',
          }
        ]
      },
      {
        state: 'billPayment',
        short_label: 'B',
        name: 'Transaction',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'receiveMoney',
            name: 'Receive Money'
          },
          {
            state: 'sendMoney',
            name: 'Send Money'
          },
        ]
      },
      {
        state: 'products',
        short_label: 'PO',
        name: 'Products',
        type: 'sub',
        icon: 'ti-view-list-alt',
        children: [
          {
            state: 'productMaster',
            name: 'Product Master',
          },
          {
            state: 'productSale',
            name: 'Product Sale',
          },
          {
            state: 'productTypeMaster',
            name: 'Product Type Master',
          }
        ]
      },

      {
        state: 'StatementOfTransaction',
        short_label: 'B',
        name: 'Statement Of Transaction',
        type: 'sub',
        icon: 'ti-stats-up',
        children: [
          {
            state: 'ClientWiseStatement',
            name: 'Client Wise Statement'
          },
          {
            state: 'SubInstitutionWiseState',
            name: 'Sub Institution Wise Statement'
          },

        ]
      },
      {
        state: 'statements',
        short_label: 'n',
        name: 'Statements',
        type: 'link',
        icon: 'ti-stats-up'
      },
      {
        state: 'insurance',
        short_label: 'in',
        name: 'Insurance',
        type: 'link',
        icon: 'ti-shield'
      },
       {
        state: 'bank',
        short_label: 'bn',
        name: 'Bank',
        type: 'link',
        icon: 'fa fa-university'
      }
    ],
  },
  {
    label: 'Settings',
    main: [
      {
        state: 'settings',
        short_label: 'M',
        name: 'Settings',
        type: 'sub',
        icon: 'ti-settings',
        children: [
          {
            state: 'changePassword',
            name: 'Change Password',
          },
          {
            state: 'setThumbDevice',
            name: 'Set Finger Print Device',
          },
          {
            state: 'profile',
            name: 'Profile',
          },
          {
            state: 'setBankDetails',
            name: 'Set Bank Details',
          }
        ]
      }
    ]
  },
  

];

// Superbbps
let MENUITEMSSuperBbps = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'master',
        short_label: 'M',
        name: 'Masters',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'institutionUserMaster',
            name: 'Create User',
          }
        ]
      },
      {
        state: 'billPayment',
        short_label: 'B',
        name: 'Transaction',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'receiveMoney',
            name: 'Receive Money'
          },
          {
            state: 'sendMoney',
            name: 'Send Money'
          },
        ]
      },
      {
        state: 'products',
        short_label: 'PO',
        name: 'Products',
        type: 'sub',
        icon: 'ti-view-list-alt',
        children: [
          {
            state: 'productMaster',
            name: 'Product Master',
          },
          {
            state: 'productSale',
            name: 'Product Sale',
          },
          {
            state: 'productTypeMaster',
            name: 'Product Type Master',
          }
        ]
      },

      {
        state: 'StatementOfTransaction',
        short_label: 'B',
        name: 'Statement Of Transaction',
        type: 'sub',
        icon: 'ti-stats-up',
        children: [
          {
            state: 'ClientWiseStatement',
            name: 'Client Wise Statement'
          },
          {
            state: 'SubInstitutionWiseState',
            name: 'Sub Institution Wise Statement'
          },

        ]
      },
      {
        state: 'statements',
        short_label: 'n',
        name: 'Statements',
        type: 'link',
        icon: 'ti-stats-up'
      },
      {
        state: 'bbps',
        short_label: 'bb',
        name: 'BBPS',
        type: 'link',
        icon: 'fas fa-handshake'
      }
      ,
      {
        state: 'insurance',
        short_label: 'in',
        name: 'Insurance',
        type: 'link',
        icon: 'ti-shield'
      },  {
        state: 'bank',
        short_label: 'bn',
        name: 'Bank',
        type: 'link',
        icon: 'fa fa-university'
      }
    ],
  },
  {
    label: 'Settings',
    main: [
      {
        state: 'settings',
        short_label: 'M',
        name: 'Settings',
        type: 'sub',
        icon: 'ti-settings',
        children: [
          {
            state: 'changePassword',
            name: 'Change Password',
          },
          {
            state: 'setThumbDevice',
            name: 'Set Finger Print Device',
          },
          {
            state: 'profile',
            name: 'Profile',
          },
          {
            state: 'setBankDetails',
            name: 'Set Bank Details',
          }
        ]
      }
    ]
  },

];
// Superbank
let MENUITEMSSuperBank = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'master',
        short_label: 'M',
        name: 'Masters',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'institutionUserMaster',
            name: 'Create User',
          }
        ]
      },
      {
        state: 'billPayment',
        short_label: 'B',
        name: 'Transaction',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'receiveMoney',
            name: 'Receive Money'
          },
          {
            state: 'sendMoney',
            name: 'Send Money'
          },
        ]
      },
      {
        state: 'products',
        short_label: 'PO',
        name: 'Products',
        type: 'sub',
        icon: 'ti-view-list-alt',
        children: [
          {
            state: 'productMaster',
            name: 'Product Master',
          },
          {
            state: 'productSale',
            name: 'Product Sale',
          },
          {
            state: 'productTypeMaster',
            name: 'Product Type Master',
          }
        ]
      },

      {
        state: 'StatementOfTransaction',
        short_label: 'B',
        name: 'Statement Of Transaction',
        type: 'sub',
        icon: 'ti-stats-up',
        children: [
          {
            state: 'ClientWiseStatement',
            name: 'Client Wise Statement'
          },
          {
            state: 'SubInstitutionWiseState',
            name: 'Sub Institution Wise Statement'
          },

        ]
      },
      {
        state: 'statements',
        short_label: 'n',
        name: 'Statements',
        type: 'link',
        icon: 'ti-stats-up'
      }
      ,
      {
        state: 'insurance',
        short_label: 'in',
        name: 'Insurance',
        type: 'link',
        icon: 'ti-shield'
      },  {
        state: 'bank',
        short_label: 'bn',
        name: 'Bank',
        type: 'link',
        icon: 'fa fa-university'
      }
    ],
  },
  {
    label: 'Settings',
    main: [
      {
        state: 'settings',
        short_label: 'M',
        name: 'Settings',
        type: 'sub',
        icon: 'ti-settings',
        children: [
          {
            state: 'changePassword',
            name: 'Change Password',
          },
          {
            state: 'setThumbDevice',
            name: 'Set Finger Print Device',
          },
          {
            state: 'profile',
            name: 'Profile',
          },
          {
            state: 'setBankDetails',
            name: 'Set Bank Details',
          }
        ]
      }
    ]
  },

];


//client
let MENUITEMSClient = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'fundtransfer',
        short_label: 'F',
        name: 'Fund Transfer',
        type: 'link',
        icon: 'fas fa-exchange-alt'
      },
      {
        state: 'billPayment',
        short_label: 'B',
        name: 'Transaction',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'receiveMoney',
            name: 'Receive Money'
          },
          {
            state: 'sendMoney',
            name: 'Send Money'
          },
        ]
      },
      {
        state: 'products',
        short_label: 'PO',
        name: 'Products',
        type: 'sub',
        icon: 'ti-view-list-alt',
        children: [
          {
            state: 'productMaster',
            name: 'Product Master',
          },
          {
            state: 'productSale',
            name: 'Product Sale',
          },
          {
            state: 'productTypeMaster',
            name: 'Product Type Master',
          }
        ]
      },
      {
        state: 'statements',
        short_label: 'n',
        name: 'Statements',
        type: 'link',
        icon: 'ti-stats-up'
      },
      {
        state: 'insurance',
        short_label: 'in',
        name: 'Insurance',
        type: 'link',
        icon: 'ti-shield'
      },
       {
        state: 'bank',
        short_label: 'bn',
        name: 'Bank',
        type: 'link',
        icon: 'fa fa-university'
      }
    ],
  },
  {
    label: 'Settings',
    main: [
      {
        state: 'settings',
        short_label: 'M',
        name: 'Settings',
        type: 'sub',
        icon: 'ti-settings',
        children: [
          {
            state: 'changePassword',
            name: 'Change Password',
          },
          {
            state: 'setThumbDevice',
            name: 'Set Finger Print Device',
          },
          {
            state: 'profile',
            name: 'Profile',
          },
          {
            state: 'closeAccount',
            short_label: 'c',
            name: 'Close Account',
            type: 'link',
            icon: 'ti-close'
          },
          {
            state: 'setBankDetails',
            name: 'Set Bank Details',
          }
        ]
      }
    ]
  },
];


//clientbbps
let MENUITEMSClientBbps = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'fundtransfer',
        short_label: 'F',
        name: 'Fund Transfer',
        type: 'link',
        icon: 'fas fa-exchange-alt'
      },
      {
        state: 'billPayment',
        short_label: 'B',
        name: 'Transaction',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'receiveMoney',
            name: 'Receive Money'
          },
          {
            state: 'sendMoney',
            name: 'Send Money'
          },
        ]
      },
      {
        state: 'products',
        short_label: 'PO',
        name: 'Products',
        type: 'sub',
        icon: 'ti-view-list-alt',
        children: [
          {
            state: 'productMaster',
            name: 'Product Master',
          },
          {
            state: 'productSale',
            name: 'Product Sale',
          },
          {
            state: 'productTypeMaster',
            name: 'Product Type Master',
          }
        ]
      },
      {
        state: 'statements',
        short_label: 'n',
        name: 'Statements',
        type: 'link',
        icon: 'ti-stats-up'
      },
      {
        state: 'bbps',
        short_label: 'bb',
        name: 'BBPS',
        type: 'link',
        icon: 'fas fa-handshake'
      }
      ,
      {
        state: 'insurance',
        short_label: 'in',
        name: 'Insurance',
        type: 'link',
        icon: 'ti-shield'
      },  {
        state: 'bank',
        short_label: 'bn',
        name: 'Bank',
        type: 'link',
        icon: 'fa fa-university'
      }
    ],
  },
  {
    label: 'Settings',
    main: [
      {
        state: 'settings',
        short_label: 'M',
        name: 'Settings',
        type: 'sub',
        icon: 'ti-settings',
        children: [
          {
            state: 'changePassword',
            name: 'Change Password',
            // target: false
          },
          {
            state: 'setThumbDevice',
            name: 'Set Finger Print Device',
          },
          {
            state: 'profile',
            name: 'Profile',
          },
          {
            state: 'closeAccount',
            short_label: 'c',
            name: 'Close Account',
            type: 'link',
            icon: 'ti-close'
          },
          {
            state: 'setBankDetails',
            name: 'Set Bank Details',
          }
        ]
      }
    ]
  },

];
//clientbank
let MENUITEMSClientBank = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'fundtransfer',
        short_label: 'F',
        name: 'Fund Transfer',
        type: 'link',
        icon: 'fas fa-exchange-alt'
      },
      {
        state: 'billPayment',
        short_label: 'B',
        name: 'Transaction',
        type: 'sub',
        icon: 'ti-layout-grid2-alt',
        children: [
          {
            state: 'receiveMoney',
            name: 'Receive Money'
          },
          {
            state: 'sendMoney',
            name: 'Send Money'
          },
        ]
      },
      {
        state: 'products',
        short_label: 'PO',
        name: 'Products',
        type: 'sub',
        icon: 'ti-view-list-alt',
        children: [
          {
            state: 'productMaster',
            name: 'Product Master',
          },
          {
            state: 'productSale',
            name: 'Product Sale',
          },
          {
            state: 'productTypeMaster',
            name: 'Product Type Master',
          }
        ]
      },
      {
        state: 'statements',
        short_label: 'n',
        name: 'Statements',
        type: 'link',
        icon: 'ti-stats-up'
      },
      {
        state: 'insurance',
        short_label: 'in',
        name: 'Insurance',
        type: 'link',
        icon: 'ti-shield'
      },  {
        state: 'bank',
        short_label: 'bn',
        name: 'Bank',
        type: 'link',
        icon: 'fa fa-university'
      }
    ],
  },
  {
    label: 'Settings',
    main: [
      {
        state: 'settings',
        short_label: 'M',
        name: 'Settings',
        type: 'sub',
        icon: 'ti-settings',
        children: [
          {
            state: 'changePassword',
            name: 'Change Password',
            // target: false
          },
          {
            state: 'setThumbDevice',
            name: 'Set Finger Print Device',
          },
          {
            state: 'profile',
            name: 'Profile',
          },
          {
            state: 'closeAccount',
            short_label: 'c',
            name: 'Close Account',
            type: 'link',
            icon: 'ti-close'
          },
          {
            state: 'setBankDetails',
            name: 'Set Bank Details',
          }
        ]
      }
    ]
  },

];


@Injectable()
export class MenuItems {
  getAll(adminFlag): Menu[] {
    if (adminFlag) {
      if (adminFlag == 'A')
        return MENUITEMSAdmin;
      if (adminFlag == 'AB')
        return MENUITEMSAdminBbps;
      if (adminFlag == 'ABN')
        return MENUITEMSAdminBank;
      else if (adminFlag == 'S')
        return MENUITEMSSuper;
      else if (adminFlag == 'SB')
        return MENUITEMSSuperBbps;
      else if (adminFlag == 'SBN')
        return MENUITEMSSuperBank;
      else if (adminFlag == 'IB')
        return MENUITEMSClientBbps;
      else if (adminFlag == 'IBN')
        return MENUITEMSClientBank;
      else
        return MENUITEMSClient
    }

  }
}