
const travels = [
    {
        path: '/travels',
        component: () => import('@/views/page.vue'),
        meta: { 
            public: false, 
            layout: 'default-layout',
            access: [1,2,3]
        },
        children: [
            { 
                path: '', 
                name: 'travels-list', 
                component: () => import(/* webpackChunkName: "travels-list" */ '@/views/travels/index.vue'),
                meta: {
                    
                }
            },
            { 
                path: ':id/view', 
                name: 'travels-view', 
                component: () => import(/* webpackChunkName: "travels-view" */'@/views/travels/view.vue'),
                meta: {
                    
                } 
            },
            
        ],
    }
]

export default travels