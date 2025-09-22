import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, MapPin, User, GraduationCap, Users, Shield } from "lucide-react";
import onboardingHero from "@/assets/onboarding-hero.jpg";
import { supabase } from "@/lib/supabaseClient";

type UserType = "student" | "teacher" | "admin";

interface OnboardingScreenProps {
  onComplete: (userType: UserType, state: string, region: string, city: string, userId: string) => void;
}

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedUserType, setSelectedUserType] = useState<UserType | "">("");
  const [schoolName, setSchoolName] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [classStandard, setClassStandard] = useState("");
  const [classSection, setClassSection] = useState("");
  const [employmentId, setEmploymentId] = useState("");
  const [govEmployeeId, setGovEmployeeId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const states = [
    "Andaman & Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal"
  ];

  const regions = ["Majha", "Doaba", "Malwa", "Puadh"];

  const regionCities: Record<string, string[]> = {
    "Majha": ["Amritsar", "Gurdaspur", "Pathankot", "Tarn Taran", "Kapurthala"],
    "Doaba": ["Jalandhar", "Hoshiarpur", "Kapurthala", "Shaheed Bhagat Singh Nagar (Nawanshahr)"],
    "Malwa": ["Ludhiana", "Patiala", "Bathinda", "Mansa", "Sangrur", "Barnala", "Fatehgarh Sahib", "SAS Nagar (Mohali)", "Rupnagar", "Faridkot", "Muktsar", "Fazilka", "Ferozepur"],
    "Puadh": ["Patiala", "Fatehgarh Sahib", "SAS Nagar (Mohali)", "Rupnagar"]
  };

  const userTypes = [
    {
      type: "student" as UserType,
      title: "Student",
      description: "Learn safety protocols and participate in drills",
      icon: GraduationCap,
      color: "bg-achievement"
    },
    {
      type: "teacher" as UserType,
      title: "Teacher",
      description: "Manage student safety and conduct educational sessions",
      icon: User,
      color: "bg-primary"
    },
    {
      type: "admin" as UserType,
      title: "Administrator",
      description: "Oversee safety programs and manage institutional preparedness",
      icon: Users,
      color: "bg-accent"
    }
  ];

  const handleNext = () => {
    setErrorMessage("");
    if (step === 1) {
      if (!name) {
        setErrorMessage("Please enter your name.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedState) {
        setErrorMessage("Please select your state.");
        return;
      }
      if (selectedState === "Punjab") {
        setStep(3);
      } else {
        setStep(4);
      }
    } else if (step === 3) {
      if (!selectedRegion) {
        setErrorMessage("Please select your region.");
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!selectedCity) {
        setErrorMessage("Please select your city.");
        return;
      }
      setStep(5);
    } else if (step === 5) {
      if (!selectedUserType) {
        setErrorMessage("Please select your user type.");
        return;
      }
      if (selectedUserType === "student") {
        setStep(6);
      } else if (selectedUserType === "teacher") {
        setStep(7);
      } else if (selectedUserType === "admin") {
        setStep(8);
      }
    } else {
      handleOnboardingComplete();
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    if (step > 1) {
      if (step === 4 && selectedState !== "Punjab") {
        setStep(2);
      } else if (step === 5) {
        if (selectedState === "Punjab") {
          setStep(4);
        } else {
          setStep(2);
        }
      } else {
        setStep(step - 1);
      }
    }
  };

  const subscribeUserToPush = async (userId: string) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging is not supported.');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    
    // NOTE: You must replace 'YOUR_VAPID_PUBLIC_KEY' with the actual key from your .env file
    const applicationServerKey = urlBase64ToUint8Array('BA4e2upT8G_1BKiIxqiBLSRLRjyoh9te36pn492MhTy9zD-CF1qDweooJtrU84QiER3A8HSSOwAzcE7jQptP03E');

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    // Call your new backend endpoint to save the subscription
    await fetch('http://localhost:8000/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subscription }),
    });
  };

  const handleOnboardingComplete = async () => {
    setIsLoading(true);
    try {
      const capitalizedUserType = selectedUserType.charAt(0).toUpperCase() + selectedUserType.slice(1);

      // Step 1: Insert into 'users' table
      const userInsertData = {
        name,
        state: selectedState,
        city: selectedCity || null,
        user_type: capitalizedUserType,
      };
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([userInsertData])
        .select("uid");

      if (userError) throw new Error(`Error inserting into 'users' table: ${userError.message}`);
      const userId = userData[0].uid;

      // After saving user data, subscribe them to push notifications
      await subscribeUserToPush(userId);

      // Step 2: Handle role-specific data insertion
      if (selectedUserType === "student" || selectedUserType === "teacher") {
        // Find or create school
        const { data: schoolData, error: schoolFetchError } = await supabase
          .from("Schools")
          .select("school_id")
          .eq("school_name", schoolName)
          .single();

        let schoolId;
        if (schoolFetchError && schoolFetchError.code !== 'PGRST116' || !schoolData) {
          const { data: newSchoolData, error: schoolInsertError } = await supabase
            .from("Schools")
            .insert([{ school_name: schoolName, state: selectedState, city: selectedCity || null }])
            .select("school_id");
          if (schoolInsertError) throw new Error(`Error inserting into 'Schools' table: ${schoolInsertError.message}`);
          schoolId = newSchoolData[0].school_id;
        } else {
          schoolId = schoolData.school_id;
        }

        if (selectedUserType === "student") {
          // Find or create class
          const { data: classData, error: classFetchError } = await supabase
            .from("Classes")
            .select("class_id")
            .eq("school_id", schoolId)
            .eq("class_name", classStandard)
            .eq("section", classSection)
            .single();

          let classId;
          if (classFetchError && classFetchError.code !== 'PGRST116' || !classData) {
            const { data: newClassData, error: classInsertError } = await supabase
              .from("Classes")
              .insert([{ school_id: schoolId, class_name: classStandard, section: classSection }])
              .select("class_id");
            if (classInsertError) throw new Error(`Error inserting into 'Classes' table: ${classInsertError.message}`);
            classId = newClassData[0].class_id;
          } else {
            classId = classData.class_id;
          }

          // Insert into Student table
          const { error: studentError } = await supabase
            .from("Student")
            .insert([{ student_id: userId, school_id: schoolId, class_id: classId, admission_no: admissionNo, learning_progress: 0 }]);
          if (studentError) throw new Error(`Error inserting into 'Student' table: ${studentError.message}`);
        } else if (selectedUserType === "teacher") {
          // Insert into Teacher table
          const { error: teacherError } = await supabase
            .from("Teacher")
            .insert([{ teacher_id: userId, school_id: schoolId, employment_id: employmentId }]);
          if (teacherError) throw new Error(`Error inserting into 'Teacher' table: ${teacherError.message}`);
        }
      } else if (selectedUserType === "admin") {
        // Insert into Admin table
        const { error: adminError } = await supabase
          .from("Admin")
          .insert([{ admin_id: userId, gov_employee_id: govEmployeeId, state: selectedState }]);
        if (adminError) throw new Error(`Error inserting into 'Admin' table: ${adminError.message}`);
      }

      onComplete(selectedUserType as UserType, selectedState, selectedRegion, selectedCity, userId);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return name !== "";
    if (step === 2) return selectedState !== "";
    if (step === 3) return selectedRegion !== "";
    if (step === 4) return selectedCity !== "";
    if (step === 5) return selectedUserType !== "";
    if (step === 6) return schoolName !== "" && admissionNo !== "" && classStandard !== "" && classSection !== "";
    if (step === 7) return schoolName !== "" && employmentId !== "";
    if (step === 8) return govEmployeeId !== "";
    return false;
  };

  const getTotalSteps = () => {
    let baseSteps = 5;
    if (selectedState === "Punjab") {
      baseSteps++;
    }
    if (selectedUserType === "student") {
      baseSteps++;
    } else if (selectedUserType === "teacher") {
      baseSteps++;
    } else if (selectedUserType === "admin") {
      baseSteps++;
    }
    return baseSteps;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="max-w-md mx-auto p-4 pt-8">
        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          {Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full mx-1 ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Back Button */}
        {step > 1 && (
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        )}

        {/* Step 1: Welcome */}
        {step === 1 && (
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                <img
                  src={onboardingHero}
                  alt="Safety First"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Shield className="w-8 h-8 text-white mb-2 mx-auto" />
                  <h1 className="text-2xl font-bold text-white">Sajag India</h1>
                  <p className="text-white/90 text-sm">Stay Safe. Stay Prepared.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Your comprehensive disaster preparedness and education platform for Indian educational institutions.
              </p>
              <Input
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
              />
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-primary to-primary-hover"
                size="lg"
                disabled={!canProceed() || isLoading}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: State Selection */}
        {step === 2 && (
          <Card>
            <CardHeader className="text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Select Your State</CardTitle>
              <p className="text-sm text-muted-foreground">
                This helps us provide state-specific alerts and information
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mb-6 max-h-60 overflow-y-auto">
                {states.map((state) => (
                  <Button
                    key={state}
                    variant={selectedState === state ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedState(state)}
                    className="h-auto py-2 text-wrap whitespace-normal font-bold w-full"
                  >
                    {state}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="w-full"
                size="lg"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Region Selection (Punjab only) */}
        {step === 3 && selectedState === "Punjab" && (
          <Card>
            <CardHeader className="text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Select Your Region</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose your region in Punjab
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mb-6">
                {regions.map((region) => (
                  <Button
                    key={region}
                    variant={selectedRegion === region ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedRegion(region)}
                    className="h-auto py-2 text-wrap whitespace-normal font-bold w-full"
                  >
                    {region}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="w-full"
                size="lg"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: City Selection */}
        {step === 4 && (
          <Card>
            <CardHeader className="text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Select Your {selectedState === "Punjab" ? "District" : "City"}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedState === "Punjab"
                  ? `Choose your district from ${selectedRegion} region`
                  : `Choose your city/district in ${selectedState}`
                }
              </p>
            </CardHeader>
            <CardContent>
              {selectedState === "Punjab" && selectedRegion ? (
                <div className="flex flex-col gap-2 mb-6 max-h-60 overflow-y-auto">
                  {regionCities[selectedRegion]?.map((city) => (
                    <Button
                      key={city}
                      variant={selectedCity === city ? "default" : "outline"}
                      size="lg"
                      onClick={() => setSelectedCity(city)}
                      className="h-auto py-2 text-wrap whitespace-normal font-bold w-full"
                    >
                      {city}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="mb-6">
                  <Input
                    placeholder="Enter City Manually"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="w-full"
                size="lg"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 5: User Type Selection */}
        {step === 5 && (
          <Card>
            <CardHeader className="text-center">
              <User className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>I am a...</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select your role to personalize your experience
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {userTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.type}
                    className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                      selectedUserType === type.type
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedUserType(type.type)}
                  >
                    <CardContent className="flex items-center p-4">
                      <div className={`p-2 rounded-lg ${type.color} mr-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{type.title}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="w-full mt-6 bg-gradient-to-r from-primary to-primary-hover"
                size="lg"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Student Details */}
        {step === 6 && (
          <Card>
            <CardHeader className="text-center">
              <GraduationCap className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Student Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your school and class information.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="School Name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
              <Input
                placeholder="Admission No."
                value={admissionNo}
                onChange={(e) => setAdmissionNo(e.target.value)}
              />
              <Input
                placeholder="Class Standard (e.g., 10th)"
                value={classStandard}
                onChange={(e) => setClassStandard(e.target.value)}
              />
              <Input
                placeholder="Class Section (e.g., 'A')"
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
              />
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 7: Teacher Details */}
        {step === 7 && (
          <Card>
            <CardHeader className="text-center">
              <User className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Teacher Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your school and employment information.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="School Name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
              <Input
                placeholder="Employment ID"
                value={employmentId}
                onChange={(e) => setEmploymentId(e.target.value)}
              />
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 8: Admin Details */}
        {step === 8 && (
          <Card>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Administrator Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your government employee ID.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Government Employee ID"
                value={govEmployeeId}
                onChange={(e) => setGovEmployeeId(e.target.value)}
              />
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            </CardContent>
          </Card>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 text-sm text-white bg-red-500 rounded-lg text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;