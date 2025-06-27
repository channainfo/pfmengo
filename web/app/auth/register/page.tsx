"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  SparklesIcon, 
  HeartIcon, 
  UserGroupIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref('password')], "Passwords must match").required("Please confirm your password"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  birthDate: yup.date()
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "You must be at least 18 years old")
    .required("Birth date is required"),
  tier: yup.string().oneOf(['spark', 'connect', 'forever']).required("Please select a tier"),
  agreeToTerms: yup.boolean().oneOf([true], "You must agree to the terms"),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultTier = searchParams.get('tier') || 'connect';
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      tier: defaultTier as any,
    },
  });

  const selectedTier = watch("tier");

  const tiers = {
    spark: {
      name: 'Spark',
      description: 'Casual dating and fun experiences',
      color: 'from-orange-500 to-red-500',
      icon: SparklesIcon,
    },
    connect: {
      name: 'Connect',
      description: 'Serious relationships and meaningful connections',
      color: 'from-blue-500 to-purple-500',
      icon: HeartIcon,
    },
    forever: {
      name: 'Forever',
      description: 'Marriage-minded individuals seeking life partners',
      color: 'from-purple-600 to-pink-600',
      icon: UserGroupIcon,
    },
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setApiError("");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/auth/register`, {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        tier: data.tier,
        birthDate: data.birthDate.toISOString(),
      });

      // Store token and user data
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to app dashboard
      router.push('/app/dashboard');
    } catch (error: any) {
      setApiError(error.response?.data?.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-gray-600">Find your perfect match today</p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Your Dating Journey
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(tiers).map(([key, tier]) => {
                const Icon = tier.icon;
                return (
                  <label
                    key={key}
                    className={`relative flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all ${
                      selectedTier === key
                        ? 'ring-2 ring-purple-500 bg-purple-50'
                        : 'border border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("tier")}
                      value={key}
                      className="sr-only"
                    />
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tier.color} p-2 mb-2`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <span className="font-semibold text-sm">{tier.name}</span>
                  </label>
                );
              })}
            </div>
            {selectedTier && (
              <p className="mt-2 text-sm text-gray-600 text-center">
                {tiers[selectedTier as keyof typeof tiers].description}
              </p>
            )}
            {errors.tier && (
              <p className="mt-1 text-sm text-red-600">{errors.tier.message}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                {...register("firstName")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                {...register("lastName")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date
            </label>
            <input
              {...register("birthDate")}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              {...register("agreeToTerms")}
              type="checkbox"
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <Link href="/terms" className="text-purple-600 hover:text-purple-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-600 hover:text-purple-700">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r ${
              tiers[selectedTier as keyof typeof tiers]?.color || 'from-purple-600 to-pink-600'
            } hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}