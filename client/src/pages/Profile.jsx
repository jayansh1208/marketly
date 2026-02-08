import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="card">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Name</label>
                        <p className="text-lg font-semibold">{user?.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Email</label>
                        <p className="text-lg font-semibold">{user?.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Account Type</label>
                        <p className="text-lg font-semibold">{user?.isAdmin ? 'Admin' : 'Customer'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
