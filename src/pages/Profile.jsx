// src/pages/Profile.jsx
const Profile = () => {
  return (
    <div className="min-h-screen bg-secondary-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text-dark mb-6">
          Mi Perfil
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-text-secondary">
            Aquí podrás ver y editar tu información personal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;