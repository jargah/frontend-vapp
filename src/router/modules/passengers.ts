
const passengers = [
    {
        path: '/passengers',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2,3]
        },
        children: [
            { 
                path: '', 
                name: 'passengers-list', 
                component: () => import(/* webpackChunkName: "passenger-list" */ '@/views/passengers/index.vue'),
                meta: {
                    
                }
            },
            { 
                path: 'add', 
                name: 'passengers-add', 
                component: () => import(/* webpackChunkName: "passenger-add" */'@/views/passengers/add.vue') 
            },
            { 
                path: ':id/view', 
                name: 'passengers-view', 
                component: () => import(/* webpackChunkName: "passenger-view" */'@/views/passengers/view.vue'),
                meta: {
                    
                } 
            },
            { 
                path: ':id/edit', 
                name: 'passengers-edit', 
                component: () => import(/* webpackChunkName: "passenger-edit" */'@/views/passengers/edit.vue') 
            },
        ],
    }
]

export default passengers