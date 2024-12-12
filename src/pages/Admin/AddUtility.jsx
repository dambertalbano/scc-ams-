import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { RFIDReaderInput } from 'rfid-reader-input';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AddUtility = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [position, setPosition] = useState('Primary');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [code, setCode] = useState(''); // RFID serial state
  const [openCardReaderWindow, setOpenCardReaderWindow] = useState(false); // RFID reader modal state

  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const handleOpenRFID = () => {
    setOpenCardReaderWindow(true);
  };

  const handleCloseRFID = () => {
    setOpenCardReaderWindow(false);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error('Image Not Selected');
      }

      const formData = new FormData();

      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('position', position);
      formData.append('number', Number(number));
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
      formData.append('code', code); // Include RFID serial in the form

      const { data } = await axios.post(backendUrl + '/api/admin/add-utility', formData, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName('');
        setPassword('');
        setEmail('');
        setAddress1('');
        setAddress2('');
        setPosition('');
        setNumber('');
        setCode(''); // Reset RFID serial state
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Utility</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
          <p>Upload User Picture</p>
        </div>

        {/* RFID Reader Section */}
        <div className="mb-4">
          <p className="font-medium">Scan RFID Card</p>
          <div className="flex items-center gap-4">
            <input
              value={code}
              className="border rounded px-3 py-2 w-full"
              type="text"
              placeholder="RFID Serial"
              readOnly
            />
            <button
              type="button"
              onClick={handleOpenRFID}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Open RFID Scanner
            </button>
          </div>
          <RFIDReaderInput
            isOpen={openCardReaderWindow}
            onRequestClose={handleCloseRFID}
            handleCodeCardRFID={setCode}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Your name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Utility Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Set Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Utility Number</p>
              <input
                onChange={(e) => setNumber(e.target.value)}
                value={number}
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Number"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Position</p>
              <select onChange={e => setPosition(e.target.value)} value={position} className='border rounded px-2 py-2' >
              <option value="Reapir Man">Reapir Man</option>
                <option value="Security Guard">Security Guard</option>
                <option value="Janitor">Janitor</option>
                <option value="Cook">Cook</option>
                <option value="Canteen Supervisor">Canteen Supervisor</option>
            </select>
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address 2"
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">
          Add utility
        </button>
      </div>
    </form>
  );
};

export default AddUtility;
