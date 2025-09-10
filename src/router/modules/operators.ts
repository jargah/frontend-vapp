
const operators = [
    {
        path: '/operators',
        component: () => import('@/views/page.vue'),
        meta: { public: false, layout: 'default-layout' },
        children: [
            { path: '', name: 'operators-list', component: () => import('@/views/operators/index.vue') },
            { path: 'add', name: 'operators-add', component: () => import('@/views/operators/add.vue') },
            { path: ':id/view', name: 'operators-view', component: () => import('@/views/operators/view.vue') },
            { path: ':id/edit', name: 'operators-edit', component: () => import('@/views/operators/edit.vue') },
        ],
    }
]

export default operators