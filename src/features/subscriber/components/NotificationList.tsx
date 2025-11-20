/*'use client'

import { useNotifications } from '@/features/subscriber/hooks/useNotifications'

export default function NotificationList() {
    const { data: notifications, isLoading } = useNotifications()

    if (isLoading) return <p className="text-center mt-10">Chargement...</p>
    if (!notifications?.length)
        return <p className="text-center text-gray-500">Aucune notification.</p>

    return (
        <ul className="divide-y divide-border">
            {notifications.map((n) => (
                <li
                    key={n.id}
                    className="p-4 hover:bg-surface dark:hover:bg-darkSurface transition"
                >
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm text-gray-500">{n.message}</p>
                </li>
            ))}
        </ul>
    )
}
*/
