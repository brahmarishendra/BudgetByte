<script lang="js" setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Fixed: Added missing reactive email variable
const email = ref('');

/*
// Fixed: Added placeholder submission handler
const forgotPass = async () => {
  console.log('Resetting password for:', email.value);
  // Your logic here (e.g., API call, routing)
  error.value = 'Password reset functionality is not implemented yet.';
  if (email.value) {
    // Simulate a successful password reset request
    alert(`Password reset link sent to ${email.value}`);
    router.push('/login'); // Redirect to login page after submission
  } else {
    alert('Please enter a valid email address.');
  }

  isSubmitting.value = false; // Reset submitting state

  // Check mail is sent or not
    // You can implement your logic here to check if the email was sent successfully

    try {
        const response = await fetch('http://localhost:8080/api/auth/EmailVerification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email.value })
        });
        
    } catch (error) {
            console.error('Error sending email verification:', error);
            alert('An error occurred while sending the email verification. Please try again later.');


}
const BackToLogin = () => {
    console.log("Navgate to Login page....")
    if (emit) {
        emit('switch-view', 'login');
    }
    if(router){
        router.push('/login')
    }

}
*/
    
</script>

<template>
  <!-- Card wrapper container matching your styles -->
  
  
    <div class="backbtn">
        <router-link to="login" class="back-link">Back to Login</router-link>
    </div>
    

  <div class="reset-card">

    <!-- Top Lock Icon -->
    <div class="icon-container">
      <div class="lock-icon">🔒</div>
    </div>

    <!-- Header Text -->
    <h2>Reset Password</h2>
    <p class="subtitle">Enter your email to reset your password.</p>
    
    <hr class="divider">

    <!-- Fixed: Changed to @submit.prevent for accessibility and standard form action -->
    <form class="reset-form" @submit.prevent="forgotPassword">
      <div class="input-group">
        <label for="email">Email Address <span class="required">*</span></label>
        
        <!-- Input wrapper matching your styled input icon styling -->
        <div class="input-wrapper">
          <span class="input-icon">✉</span>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="hello@alignui.com" 
            required 
          />
        </div>
      </div>

      <button type="submit" class="submit-btn" @submit="forgotPass">Reset Password</button>
    </form>

    <!-- Bottom Footer Links -->
    <div class="card-footer">
      <p>Don't have access anymore?</p> 
    </div>

  </div>
</template>

<style scoped> 
/* Base card container styling */
body {
  background-color: #f5f5f5; /* Light gray background for the entire page */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
}

.reset-card {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  justify-content: center;
  align-items: center;
  justify-items: center;
  max-width: 420px;
  margin: 40px auto;
  background-color: #ffffff;
  border-radius: 1px; /* Smooth rounded corners */
  padding: 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  text-align: center;
  border: 1px solid #f0f0f0;
}

.backbtn {
    text-align: left;
    margin-left: 14px;
    font-size: 14px;
    text-decoration: none;
    font-weight: 500;
    font: "Segoe UI", Roboto, sans-serif;
}

/* Top lock icon design */
.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background-color: #f8f9fa;
  border-radius: 50%;
  border: 1px solid #eaeaea;
  margin-bottom: 20px;
}
.lock-icon {
  font-size: 20px;
  color: #6c757d;
}

/* Typography styles */
.reset-card h2 {
  font-size: 22px;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  font-weight: 600;
}
.reset-card .subtitle {
  font-size: 14px;
  color: #666666;
  margin: 0 0 24px 0;
}

/* Subtle dashed separator line */
.divider {
  border: none;
  border-top: 1px dashed #e0e0e0;
  margin-bottom: 24px;
}

/* Form input formatting */
.reset-form {
  text-align: left;
}
.input-group {
  margin-bottom: 20px;
}
.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
}
.input-group .required {
  color: #d9534f;
}

/* Input container with icon */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 12px;
  color: #999999;
}
.input-wrapper input {
  width: 100%;
  padding: 12px 12px 12px 36px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box; /* Prevents input overflow */
}
/* Orange accent border highlight on click/focus matching the image */
.input-wrapper input:focus {
  border-color: #e17055; 
}

/* Dark charcoal primary button styling */
.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #2d2d2d; 
  color: #ffffff;
  border: none;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.submit-btn:hover {
  background-color: #0311aa;
}

/* Bottom text links */
.card-footer {
  margin-top: 24px;
  font-size: 14px;
}
.card-footer p {
  color: #666666;
  margin: 0 0 4px 0;
}
.footer-link {
  color: #1a1a1a;
  text-decoration: underline;
  font-weight: 500;
}
.footer-link:hover {
  color: #444444;
}

@media (max-width: 480px) {
  .reset-card {
    margin: 20px;
    margin-top: 30%;
    padding-top: 20px;
}

.backbtn {
    text-align: left;
    margin-left: 14px;
    font-size: 14px;
    text-decoration: none;
    font-weight: 500;
    font: "Segoe UI", Roboto, sans-serif;
    
}

}
</style>
