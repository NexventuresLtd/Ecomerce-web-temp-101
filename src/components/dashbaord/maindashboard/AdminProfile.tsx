import React, { useState } from 'react';
import { User, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { resolveImageUrl } from '../../../app/utils/resolveImageUrl';
import { getAdminErrorMessage } from '../../../app/utils/getAdminErrorMessage';

const AdminProfile: React.FC = () => {
    const { user } = useCurrentUser();

    // Profile fields
    const [fname, setFname] = useState(user?.fname || '');
    const [lname, setLname] = useState(user?.lname || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [photoPreview, setPhotoPreview] = useState<string | undefined>(user?.profile_pic || undefined);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);

    // Password fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);

    // React only sets these once on first render (useState initializer) — sync
    // them when the live user finishes loading.
    React.useEffect(() => {
        if (!user) return;
        setFname(user.fname || '');
        setLname(user.lname || '');
        setPhone(user.phone || '');
        setPhotoPreview(user.profile_pic || undefined);
    }, [user?.id]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        if (!user?.id) return;
        setSavingProfile(true);
        setProfileMsg(null);
        try {
            let newProfilePic = user.profile_pic;
            if (photoFile) {
                const form = new FormData();
                form.append('file', photoFile);
                const res = await mainAxios.post(`/auth/users/${user.id}/avatar`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                newProfilePic = res.data.profile_pic;
            }

            const res = await mainAxios.put(`/auth/users/${user.id}`, { fname, lname, phone });

            const store = localStorage.getItem('authToken') ? localStorage : sessionStorage;
            const stored = store.getItem('userInfo');
            if (stored) {
                store.setItem('userInfo', JSON.stringify({ ...JSON.parse(stored), ...res.data.user, profile_pic: newProfilePic }));
            }
            setPhotoFile(null);
            setProfileMsg({ ok: true, text: 'Profile updated!' });
        } catch (err) {
            setProfileMsg({ ok: false, text: getAdminErrorMessage(err, 'Could not update profile') });
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordMsg(null);
        if (newPassword.length < 6) {
            setPasswordMsg({ ok: false, text: 'New password must be at least 6 characters' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMsg({ ok: false, text: 'Passwords do not match' });
            return;
        }
        setChangingPassword(true);
        try {
            await mainAxios.put('/auth/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
            });
            setPasswordMsg({ ok: true, text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPasswordMsg({ ok: false, text: getAdminErrorMessage(err, 'Could not change password') });
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            {/* Profile card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h2>
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                            {photoPreview ? (
                                <img src={resolveImageUrl(photoPreview)} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                        <label className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                            <Camera className="w-4 h-4" />
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Click the camera icon to change your photo</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input type="text" value={fname} onChange={(e) => setFname(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input type="text" value={lname} onChange={(e) => setLname(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+250781234567" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" value={user?.email || ''} disabled
                            className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-3 py-2.5 text-sm cursor-not-allowed" />
                    </div>
                </div>

                {profileMsg && (
                    <p className={`text-sm mt-4 ${profileMsg.ok ? 'text-green-600' : 'text-red-600'}`}>{profileMsg.text}</p>
                )}

                <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile || !fname.trim()}
                    className="mt-6 px-5 py-2.5 bg-primary hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium"
                >
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Password card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-700" />
                    Change Password
                </h2>
                <p className="text-sm text-gray-500 mb-6">Update the password you use to sign in.</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="At least 6 characters"
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {passwordMsg && (
                    <p className={`text-sm mt-4 ${passwordMsg.ok ? 'text-green-600' : 'text-red-600'}`}>{passwordMsg.text}</p>
                )}

                <button
                    onClick={handleChangePassword}
                    disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                    className="mt-6 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-lg font-medium"
                >
                    {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
            </div>
        </div>
    );
};

export default AdminProfile;
