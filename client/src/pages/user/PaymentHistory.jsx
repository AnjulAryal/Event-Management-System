import React from 'react';
import UserPageContainer from "../../components/user/UserPageContainer";
import UserPageHeader from "../../components/user/UserPageHeader";

export default function PaymentHistory() {
    return (
        <UserPageContainer>
            <UserPageHeader 
                title="Payment History" 
                subtitle="View all your past transactions and payment details."
            />
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mt-6">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💳</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Transactions Yet</h3>
                    <p className="text-slate-500 font-medium">You haven't made any payments for events yet.</p>
                </div>
            </div>
        </UserPageContainer>
    );
}
