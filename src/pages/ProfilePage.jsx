import { useEffect, useState } from 'react';
import { axiosInstance } from '../config/axiosInstance';
import { Camera } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/user/profile', { withCredentials: true });
      setProfile(response?.data?.data);
      setName(response?.data?.data?.fullName || '');
      setEmail(response?.data?.data?.email || '');
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };



    // Handle file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
        } else {
            setError('Please select a valid image file');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedImage) {
            setError('No image selected');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await axiosInstance.put('/user/updateProfilePic', formData,{withCredentials:true}, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
console.log(response);
toast.success(response.data.message)
fetchProfile()
            setMessage(response.data.message);
        } catch (err) {
          console.log(err);
          toast.error(err.response?.data?.message)
            setError(err.response?.data?.message || 'Error updating profile picture');
        }
    };

  useEffect(() => {
    fetchProfile();
  }, []);

  const createdAt = profile?.createdAt;
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-white flex items-center justify-center min-h-screen" 
    style={{
      backgroundImage: `url('https://i.ytimg.com/vi/VpPLd4YNOTs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLALeDGp13nSEF4N2seAWz3x8VV6bw')`,
    }}
    >
      <div className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <i className="fas fa-arrow-left text-green-600"></i>
          <h1 className="text-lg font-semibold text-gray-800">Profile</h1>
          <div></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              alt="Profile picture of Jessica"
              className="w-24 h-24 rounded-full object-cover "
              src={profile?.profilePic}
            />
            <div className="absolute bottom-0 right-0 p-1 bg-green-600 text-cyan-100 rounded-full cursor-pointer">
              <label htmlFor="image">
                <Camera className='cursor-pointer' />
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden "
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="flex items-center mb-2">
              <i className="fas fa-user text-gray-500 mr-2"></i>
              <div className="text-left">
                <p className="text-sm text-gray-500">Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    className="text-lg font-semibold text-gray-800 border-b-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-800">{profile?.fullName}</p>
                )}
              </div>
              <i
                className="fas fa-pen text-gray-500 ml-2 cursor-pointer"
                onClick={() => setIsEditing(!isEditing)}
              ></i>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              This is not your username or pin. This name will be visible to your ChatApp contacts.
            </p>
            <div className="flex items-center mb-2">
              <i className="fas fa-info-circle text-gray-500 mr-2"></i>
              <div className="text-left">
                <p className="text-sm text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    className="text-lg font-semibold text-gray-800 border-b-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-800">{profile?.email}</p>
                )}
              </div>
              <i
                className="fas fa-pen text-gray-500 ml-2 cursor-pointer"
                onClick={() => setIsEditing(!isEditing)}
              ></i>
            </div>
            <div className="flex items-center">
              <i className="fas fa-phone text-gray-500 mr-2"></i>
              <div className="text-left">
                <p className="text-sm text-gray-500">Since:</p>
                <p className="text-base font-semibold text-gray-800">{formattedDate}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
                {/* <div className="form-group">
                    <label htmlFor="image">Choose a profile picture</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="form-control"
                        onChange={handleImageChange}
                    />
                </div> */}
                <button type="submit" className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full">
                Update Picture
              </button>
            </form>
            {isEditing && (
              <button
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full"
                onClick={handleProfileUpdate}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
