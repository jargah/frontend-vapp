
const typeTaxi = [
    {
        path: '/type-taxi',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2]
        },
        children: [
            { 
                path: '', 
                name: 'type-taxi-list', 
                component: () => import(/* webpackChunkName: "type-taxi-list" */ '@/views/type_taxi/index.vue'),
                meta: {
                    
                }
            },
            { 
                path: 'add', 
                name: 'type-taxi-add', 
                component: () => import(/* webpackChunkName: "type-taxi-add" */ '@/views/type_taxi/add.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/view', 
                name: 'type-taxi-view', 
                component: () => import(/* webpackChunkName: "type-taxi-view" */ '@/views/type_taxi/view.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/edit', 
                name: 'type-taxi-edit', 
                component: () => import(/* webpackChunkName: "type-taxi-view" */ '@/views/type_taxi/edit.vue'),
                meta: {
                    
                }
            }
        ],
    }
]

export default typeTaxi