'use client'

import { type User } from '@supabase/supabase-js'

export default function AccountForm({ user }: { user: User }) {

    return (
        <div className="form-widget">
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="text"
                    value={user?.email}
                    disabled
                />
            </div>
        </div>
    )
}