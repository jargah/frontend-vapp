
const operators = [
    {
        path: '/operators',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2,3]
        },
        children: [
            { 
                path: '', 
                name: 'operators-list', 
                component: () => import(/* webpackChunkName: "operator-list" */ '@/views/operators/index.vue'),
                meta: {
                    
                }
            },
            { 
                path: 'add', 
                name: 'operators-add', 
                component: () => import(/* webpackChunkName: "operator-add" */'@/views/operators/add.vue') 
            },
            { 
                path: ':id/view', 
                name: 'operators-view', 
                component: () => import(/* webpackChunkName: "operator-view" */'@/views/operators/view.vue'),
                meta: {
                    
                } 
            },
            { 
                path: ':id/edit', 
                name: 'operators-edit', 
                component: () => import(/* webpackChunkName: "operator-edit" */'@/views/operators/edit.vue') 
            },
        ],
    }
]

export default operators