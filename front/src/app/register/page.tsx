"use client";
import React, { useState } from "react";

type FormData = {
  name: string;
  lastname: string;
  email: string;
  password: string;
  price: number | "";
  phone: string;
  nationality: string;
  dni: string;
  description: string;
  address: string;
  hasMinor: boolean;
  DOB: string;
  pets: string;
  Ac: string;
  civilStatus: "single" | "married" | "divorced" | "widowed";
  employmentStatus: "unemployed" | "employed" | "student" | "retired";
};

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    lastname: "",
    email: "",
    password: "",
    price: "",
    phone: "",
    nationality: "",
    dni: "",
    description: "",
    address: "",
    hasMinor: false,
    DOB: "",
    pets: "",
    Ac: "",
    civilStatus: "single",
    employmentStatus: "unemployed",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? +value : value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-md shadow-md max-w-lg mx-auto">
      <div className="relative">
        <label className="sr-only">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Name"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Last Name</label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Last Name"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Email"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Password"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Price"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Phone"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Nationality</label>
        <input
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Nationality"
        />
      </div>

      <div className="relative">
        <label className="sr-only">DNI</label>
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="DNI"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Description"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Address"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Has Minor</label>
        <input
          type="checkbox"
          name="hasMinor"
          checked={formData.hasMinor}
          onChange={handleChange}
          className="w-6 h-6"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Date of Birth</label>
        <input
          type="date"
          name="DOB"
          value={formData.DOB}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Pets</label>
        <input
          type="text"
          name="pets"
          value={formData.pets}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Pets"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Air Conditioning</label>
        <input
          type="text"
          name="Ac"
          value={formData.Ac}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
          placeholder="Air Conditioning"
        />
      </div>

      <div className="relative">
        <label className="sr-only">Civil Status</label>
        <select
          name="civilStatus"
          value={formData.civilStatus}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
        >
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
      </div>

      <div className="relative">
        <label className="sr-only">Employment Status</label>
        <select
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-[#0a0a0a] text-lg placeholder-gray-500 focus:outline-none p-2"
        >
          <option value="unemployed">Unemployed</option>
          <option value="employed">Employed</option>
          <option value="student">Student</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
    </form>
  );
};

export default RegisterForm;
