import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import API from '../../services/api';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Retrieve current logged-in user to prevent self-deletion
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/users');
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error("User Sync Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (id === userInfo._id) {
      alert("Security Protocol: You cannot delete your own administrative account.");
      return;
    }

    if (window.confirm('Revoke access and permanently delete this user account?')) {
      try {
        await API.delete(`/users/${id}`);
        fetchUsers(); // Refresh the list
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans text-[#0f1111]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-normal tracking-tight">User Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage global user access and administrative rights</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#d5d9d9] overflow-hidden">
          {/* Table Controls */}
          <div className="p-4 border-b border-[#d5d9d9] bg-[#f0f2f2] flex justify-between items-center">
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search Name or Email" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-8 pr-3 py-1.5 border border-[#a6a6a6] rounded shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)] text-sm w-full sm:w-64" 
               />
               <Search size={16} className="absolute left-2.5 top-2 text-gray-500" />
             </div>
             <div className="text-sm text-gray-600">
               {filteredUsers.length} active users
             </div>
          </div>

          {loading ? (
            <div className="p-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f0f2f2] border-b border-[#d5d9d9]">
                  <tr>
                    <th className="px-6 py-3 font-bold text-gray-700">Name</th>
                    <th className="px-6 py-3 font-bold text-gray-700">Email Address</th>
                    <th className="px-6 py-3 font-bold text-gray-700">Account Type</th>
                    <th className="px-6 py-3 font-bold text-gray-700 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d5d9d9]">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-[#f3f4f4] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#007185] hover:underline cursor-pointer hover:text-[#c7511f]">
                          {u.name} {u._id === userInfo._id && '(You)'}
                        </div>
                        <div className="font-mono text-xs text-gray-500 mt-1">ID: {u._id}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        {u.isAdmin ? (
                          <span className="bg-[#007185] text-white px-2 py-0.5 rounded text-[10px] w-fit font-bold uppercase tracking-wide">
                            Admin
                          </span>
                        ) : (
                          <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-[10px] w-fit font-bold uppercase tracking-wide">
                            Customer
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => navigate(`/admin/user/${u._id}/edit`)}
                            className="bg-white border border-[#d5d9d9] hover:bg-gray-50 py-1 px-3 rounded-lg shadow-sm font-normal text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteHandler(u._id)}
                            className={`py-1 px-3 rounded-lg shadow-sm font-normal text-xs transition-colors border ${
                              u._id === userInfo._id 
                              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                              : 'bg-white border-[#d5d9d9] text-[#B12704] hover:bg-red-50 hover:border-red-200'
                            }`}
                            disabled={u._id === userInfo._id}
                            title={u._id === userInfo._id ? "Cannot delete own account" : "Delete User"}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                     <tr>
                       <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                         No users matching search criteria.
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListScreen;