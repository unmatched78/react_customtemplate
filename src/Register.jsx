// src/Register.jsx
import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from './api';
import { Link } from 'react-router-dom';

// shadcn/ui components
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
// HeroUI Button
import { Button } from '@heroui/react';
// Radix Select for industry dropdown
import * as Select from '@radix-ui/react-select';

const INDUSTRY_OPTIONS = [
  { value: 'construction',  label: 'Construction' },
  { value: 'education',     label: 'Education'    },
  { value: 'manufacturing', label: 'Manufacturing'},
  { value: 'retail',        label: 'Retail'},
  { value: 'technology',    label: 'Technology'},
  { value: 'finance',       label: 'Finance'},
  { value: 'hospitality',   label: 'Hospitality'},
  { value: 'transportation',label: 'Transportation'},
  { value: 'real_estate',   label: 'Real Estate'},
  { value: 'agriculture',   label: 'Agriculture'},
  { value: 'healthcare',    label: 'Healthcare'},
  { value: 'energy',        label: 'Energy'},
  { value: 'telecommunications', label: 'Telecommunications'},
  { value: 'media',         label: 'Media'},
  { value: 'non_profit',    label: 'Non-Profit'},
  { value: 'government',    label: 'Government'},
  { value: 'automotive',    label: 'Automotive'},
  { value: 'food_service',  label: 'Food Service'},
  { value: 'aerospace',     label: 'Aerospace'},
  { value: 'mining',        label: 'Mining'},
  { value: 'insurance',     label: 'Insurance'},
  { value: 'consulting',    label: 'Consulting'},
  { value: 'legal',         label: 'Legal'},
  { value: 'gaming',        label: 'Gaming'},
  { value: 'other',         label: 'Other'},
];

export default function Register() {
  const [orgName, setOrgName]     = useState('');
  const [industry, setIndustry]   = useState('');
  const [username, setUsername]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Create org + admin
      const { data } = await api.post('/register_org/', {
        org_name: orgName,
        industry,
        username,
        email,
        password,
      });

      // Show pending-approval notice (no auto-login or redirect)
      setSuccess(
        data.detail ||
        '✅ Registration successful! We’ll reach out shortly to finish onboarding.'
      );

      // Clear form fields
      setOrgName('');
      setIndustry('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirm('');
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.detail ||
        'Registration failed. Please check your inputs.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
          Create Organization & Admin
        </h2>

        {/* Error or Success Message */}
        {(error || success) && (
          <p
            className={`text-center ${
              error ? 'text-red-500' : 'text-green-600'
            }`}
          >
            {error || success}
          </p>
        )}

        {/* Organization Name */}
        <div>
          <Label htmlFor="orgName">Organization Name</Label>
          <Input
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
            placeholder="Acme Corp."
            className="mt-1"
          />
        </div>

        {/* Industry Select */}
        <div>
          <Label>Industry</Label>
          <Select.Root
            onValueChange={setIndustry}
            value={industry}
          >
            <Select.Trigger className="w-full mt-1 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex justify-between items-center">
              <Select.Value placeholder="Select industry" />
              <Select.Icon>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 011.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z" />
                </svg>
              </Select.Icon>
            </Select.Trigger>
            <Select.Content className="mt-1 bg-white dark:bg-gray-800 border rounded shadow-lg">
              <Select.ScrollUpButton />
              <Select.Viewport>
                {INDUSTRY_OPTIONS.map((opt) => (
                  <Select.Item
                    key={opt.value}
                    value={opt.value}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <Select.ItemText>
                      {opt.label}
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton />
            </Select.Content>
          </Select.Root>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Admin Username */}
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="admin_user"
            className="mt-1"
          />
        </div>

        {/* Admin Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@acme.com"
            className="mt-1"
          />
        </div>

        {/* Password & Confirm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <Button type="submit" className="w-full">
            Create & Continue
          </Button>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-500 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
