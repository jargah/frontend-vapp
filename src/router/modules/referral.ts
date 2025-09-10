
const referral = [
    {
        path: '/referrals',
        component: () => import('@/views/page.vue'),
        meta: { public: false, layout: 'default-layout' },
        children: [
            { path: '', name: 'referrals-list', component: () => import('@/views/referral/index.vue') },
            { path: 'add', name: 'referrals-add', component: () => import('@/views/referral/add.vue') },
            { path: ':id/view', name: 'referrals-view', component: () => import('@/views/referral/view.vue') },
            { path: ':id/edit', name: 'referrals-edit', component: () => import('@/views/referral/edit.vue') },
        ],
    },
    { path: '/referral-programs', name: 'referral-programs', component: () => import('@/views/referral/programs.vue') },
    { path: '/referral-products', name: 'referral-products', component: () => import('@/views/referral/products.vue') },
]
export default referral