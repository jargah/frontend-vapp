
const prospects = [
    {
        path: '/prospects',
        component: () => import('@/views/page.vue'),
        meta: { public: false, layout: 'default-layout' },
        children: [
            { 
                path: '', 
                name: 'prospects-list', 
                component: () => import('@/views/prospects/index.vue') 
            },
            { 
                path: 'add', 
                name: 'prospects-add', 
                component: () => import('@/views/prospects/add.vue') 
            },
            { 
                path: ':id/view', 
                name: 'prospects-view', 
                component: () => import('@/views/prospects/view.vue') 
            },
            { 
                path: ':id/edit', 
                name: 'prospects-edit', 
                component: () => import('@/views/prospects/edit.vue') 
            },
        ],
    }
]

export default prospects