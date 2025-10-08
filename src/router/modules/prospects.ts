
const prospects = [
    {
        path: '/prospects',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2,3]
        },
        children: [
            { 
                path: '', 
                name: 'prospects-list', 
                component: () => import(/* webpackChunkName: "prospect-list" */ '@/views/prospects/index.vue'),
                meta: {
                    
                }
            },
            { 
                path: 'add', 
                name: 'prospects-add', 
                component: () => import(/* webpackChunkName: "prospect-add" */'@/views/prospects/add.vue') 
            },
            { 
                path: ':id/view', 
                name: 'prospects-view', 
                component: () => import(/* webpackChunkName: "prospect-view" */'@/views/prospects/view.vue'),
                meta: {
                    
                } 
            },
            { 
                path: ':id/edit', 
                name: 'prospects-edit', 
                component: () => import(/* webpackChunkName: "prospect-edit" */'@/views/prospects/edit.vue') 
            },
        ],
    }
]

export default prospects