import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      toast.success('Account created successfully.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-2xl text-text-primary">The Curated Store</Link>
          <h1 className="font-serif text-3xl mt-6 text-text-primary">Create Your Account</h1>
          <p className="text-text-secondary text-sm mt-2">
            Join thousands of customers who trust us for quality products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
              <input
                id="reg-name" name="fullName" type="text" value={formData.fullName}
                onChange={handleChange} className={`input-field ${errors.fullName ? 'border-error' : ''}`}
                placeholder="Your full name"
              />
              {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
              <input
                id="reg-email" name="email" type="email" value={formData.email}
                onChange={handleChange} className={`input-field ${errors.email ? 'border-error' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="reg-phone" className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
              <input
                id="reg-phone" name="phone" type="tel" value={formData.phone}
                onChange={handleChange} className={`input-field ${errors.phone ? 'border-error' : ''}`}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="reg-password" name="password" type={showPassword ? 'text' : 'password'}
                  value={formData.password} onChange={handleChange}
                  className={`input-field pr-10 ${errors.password ? 'border-error' : ''}`}
                  placeholder="Minimum 8 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-text-primary mb-1.5">Confirm Password</label>
              <input
                id="reg-confirm" name="confirmPassword" type="password" value={formData.confirmPassword}
                onChange={handleChange} className={`input-field ${errors.confirmPassword ? 'border-error' : ''}`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
