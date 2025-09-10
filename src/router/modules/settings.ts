const settings = [
    {
        path: '/settings',
        component: () => import('@/views/page.vue'),
        meta: { public: false, layout: 'default-layout' },
        children: [
            {
                path: '',
                name: 'settings-list',
                component: () => import('@/views/settings/index.vue'),
                meta: { public: false, layout: 'default-layout' },
            },
            {
                path: 'add',
                name: 'settings-add',
                component: () => import('@/views/settings/add.vue'),
                meta: { public: false, layout: 'default-layout' },
            },
            {
                path: ':id/view',
                name: 'settings-view',
                component: () => import('@/views/settings/view.vue'),
                meta: { public: false, layout: 'default-layout' },
            },
            {
                path: ':id/edit',
                name: 'settings-edit',
                component: () => import('@/views/settings/edit.vue'),
                meta: { public: false, layout: 'default-layout' },
            },
        ],
    }
]

export default settings
