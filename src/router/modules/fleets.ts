
const fleets = [
    {
        path: '/fleets',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2,3]
        },
        children: [
            { 
                path: '', 
                name: 'fleets-list', 
                component: () => import(/* webpackChunkName: "fleet-list" */ '@/views/fleets/index.vue'),
                meta: {
                    
                }
            },
            // { 
            //     path: 'add', 
            //     name: 'fleets-add', 
            //     component: () => import(/* webpackChunkName: "operator-add" */'@/views/fleets/add.vue') 
            // },
            // { 
            //     path: ':id/view', 
            //     name: 'fleets-view', 
            //     component: () => import(/* webpackChunkName: "operator-view" */'@/views/fleets/view.vue'),
            //     meta: {
                    
            //     } 
            // },
            // { 
            //     path: ':id/edit', 
            //     name: 'fleets-edit', 
            //     component: () => import(/* webpackChunkName: "operator-edit" */'@/views/fleets/edit.vue') 
            // },
        ],
    }
]

export default fleets