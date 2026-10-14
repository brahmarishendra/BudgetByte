<script setup>
defineProps({
  variant: {
    type: String,
    default: 'payment' // 'payment' | 'coins' | 'security'
  }
});
</script>

<template>
  <div class="illustration-hero">
    <!-- Background soft aura -->
    <div class="hero-bg-accent"></div>

    <!-- Variant 1: Hand holding smartphone with Pay button & coins dropping into green savings vault -->
    <svg 
      v-if="variant === 'payment'" 
      class="hero-svg" 
      viewBox="0 0 340 220" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- Coin Gradients -->
        <linearGradient id="goldCoin1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="50%" stop-color="#facc15" />
          <stop offset="100%" stop-color="#ca8a04" />
        </linearGradient>
        <linearGradient id="goldCoin2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef9c3" />
          <stop offset="70%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#a16207" />
        </linearGradient>
        <!-- Box Gradients -->
        <linearGradient id="boxFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#65a30d" />
          <stop offset="100%" stop-color="#3f6212" />
        </linearGradient>
        <linearGradient id="boxSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1e3a12" />
          <stop offset="100%" stop-color="#14260b" />
        </linearGradient>
        <!-- Phone Gradient -->
        <linearGradient id="phoneBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#84cc16" />
          <stop offset="100%" stop-color="#4d7c0f" />
        </linearGradient>
      </defs>

      <!-- Sparkles / Little Stars -->
      <path d="M72 40L74 44L78 46L74 48L72 52L70 48L66 46L70 44Z" fill="#a3e635" opacity="0.85" />
      <path d="M268 76L270 79L273 80L270 81L268 84L266 81L263 80L266 79Z" fill="#facc15" opacity="0.9" />
      <path d="M125 32L127 35L130 36L127 37L125 40L123 37L120 36L123 35Z" fill="#eab308" opacity="0.8" />
      <line x1="56" y1="62" x2="64" y2="58" stroke="#a3e635" stroke-width="1.5" stroke-linecap="round" />
      <line x1="62" y1="108" x2="52" y2="104" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round" />
      <line x1="280" y1="120" x2="295" y2="120" stroke="#84cc16" stroke-width="1.5" stroke-linecap="round" />

      <!-- Floating Gold Coins with ₹ symbols -->
      <!-- Coin 1 (Top Left) -->
      <g class="float-coin-1">
        <circle cx="82" cy="74" r="15" fill="url(#goldCoin1)" stroke="#ca8a04" stroke-width="1.5" />
        <circle cx="82" cy="74" r="11.5" stroke="#fef08a" stroke-width="1" stroke-dasharray="2 2" fill="none" />
        <text x="82" y="79" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="900" fill="#854d0e" text-anchor="middle">₹</text>
      </g>

      <!-- Coin 2 (Middle Left) -->
      <g class="float-coin-2">
        <circle cx="78" cy="124" r="18" fill="url(#goldCoin2)" stroke="#ca8a04" stroke-width="1.8" />
        <circle cx="78" cy="124" r="14" stroke="#fef9c3" stroke-width="1.2" stroke-dasharray="2.5 2" fill="none" />
        <text x="78" y="130" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="900" fill="#854d0e" text-anchor="middle">₹</text>
      </g>

      <!-- Savings Vault / Cash Box (Bottom Center-Left) -->
      <g id="money-vault">
        <!-- Vault Left Dark Flap -->
        <path d="M42 165L82 152V205L42 215V165Z" fill="url(#boxSide)" />
        <!-- Vault Top / Slot Lid -->
        <path d="M42 165L82 152L170 152L130 165H42Z" fill="#365314" />
        <!-- Coin Slot -->
        <ellipse cx="98" cy="160" rx="14" ry="3.5" fill="#14260b" />
        <!-- Coin Entering Slot -->
        <ellipse cx="98" cy="156" rx="8" ry="8" fill="url(#goldCoin1)" stroke="#ca8a04" stroke-width="1" />
        <text x="98" y="160" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="900" fill="#854d0e" text-anchor="middle">₹</text>
        <!-- Vault Front Panel -->
        <path d="M82 152H170V205H82V152Z" fill="url(#boxFront)" />
        <!-- Vault Front Decorative Lines -->
        <path d="M88 160C100 168 120 162 135 170C150 178 158 174 165 180" stroke="#84cc16" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7" />
        <path d="M92 185C108 190 128 184 145 192C155 196 160 194 166 198" stroke="#84cc16" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6" />
      </g>

      <!-- Arm & Hand Holding Mobile Phone -->
      <g id="hand-and-phone">
        <!-- Arm reaching from bottom right -->
        <path d="M220 220C215 190 205 168 188 152C182 146 172 138 162 142C152 146 148 158 152 170C156 182 170 205 195 220H220Z" fill="#b45309" />
        <path d="M255 220L215 175C200 158 190 148 180 142C172 138 165 142 162 148C156 160 168 185 195 210L205 220H255Z" fill="#c2410c" opacity="0.85" />
        <!-- Arm main skin volume -->
        <path d="M290 220C280 185 250 148 220 126C198 110 185 112 175 118C162 126 160 138 165 152C172 172 195 198 230 220H290Z" fill="#b45309" />

        <!-- Smartphone Angled in Hand -->
        <g transform="rotate(-14 150 115)">
          <!-- Phone Shadow & Outer Shell -->
          <rect x="122" y="32" width="68" height="118" rx="14" fill="#365314" />
          <rect x="124" y="34" width="64" height="114" rx="12" fill="url(#phoneBody)" />
          <!-- Phone Glass Screen -->
          <rect x="128" y="40" width="56" height="102" rx="8" fill="#f8fafc" />
          
          <!-- Curved Green Arrow / Check on Screen -->
          <path d="M156 82C150 82 144 76 144 68C144 60 150 55 156 52" stroke="#65a30d" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M152 50L158 52L156 58" fill="#65a30d" />

          <!-- PAY Pill Button -->
          <rect x="136" y="94" width="40" height="18" rx="9" fill="#84cc16" />
          <text x="156" y="106.5" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="800" fill="#14532d" text-anchor="middle">PAY</text>
          
          <!-- Small Camera Notch -->
          <circle cx="156" cy="37" r="1.5" fill="#365314" />
        </g>

        <!-- Forefinger & Thumb Wrapping Phone -->
        <!-- Thumb with Golden Ring -->
        <path d="M192 125C198 120 205 124 202 135C198 145 188 152 178 150C168 148 162 140 168 132C172 126 182 128 192 125Z" fill="#c2410c" />
        <!-- Golden Ring on Finger -->
        <ellipse cx="194" cy="132" rx="4" ry="7" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" transform="rotate(-15 194 132)" />
        
        <!-- Fingers gripping side of phone -->
        <path d="M140 92C140 88 144 86 148 88C152 90 153 96 150 102C147 106 142 108 139 104C137 102 140 95 140 92Z" fill="#b45309" />
        <path d="M142 106C142 102 146 100 150 102C154 104 155 110 152 116C149 120 144 122 141 118C139 116 142 109 142 106Z" fill="#9a3412" />
        <path d="M145 120C145 116 149 114 153 116C157 118 158 124 155 130C152 134 147 136 144 132C142 130 145 123 145 120Z" fill="#7c2d12" />
      </g>
    </svg>

    <!-- Variant 2: Security & Password Reset Illustration -->
    <svg 
      v-else-if="variant === 'security'" 
      class="hero-svg" 
      viewBox="0 0 340 220" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#84cc16" />
          <stop offset="100%" stop-color="#365314" />
        </linearGradient>
        <linearGradient id="goldKey" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="70%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#a16207" />
        </linearGradient>
      </defs>

      <!-- Background Stars & Glow -->
      <path d="M60 40L62 44L66 46L62 48L60 52L58 48L54 46L58 44Z" fill="#a3e635" opacity="0.85" />
      <path d="M280 60L282 63L285 64L282 65L280 68L278 65L275 64L278 63Z" fill="#facc15" opacity="0.9" />
      <line x1="48" y1="110" x2="62" y2="106" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round" />

      <!-- Hand dropping key / token into vault -->
      <!-- Arm from top right -->
      <path d="M290 30C260 55 240 75 220 90C205 102 192 108 182 100C174 92 176 80 186 68C200 52 225 35 260 20L290 30Z" fill="#b45309" />
      
      <!-- Hand fingers releasing Golden Security Key -->
      <path d="M182 100C176 106 166 112 158 108C152 104 154 94 162 88C170 82 180 84 186 92" fill="#c2410c" />
      <!-- Gold Ring -->
      <ellipse cx="198" cy="80" rx="3.5" ry="6.5" fill="#facc15" stroke="#ca8a04" stroke-width="1" transform="rotate(35 198 80)" />

      <!-- Golden Key Floating Down -->
      <g class="float-key" transform="translate(130, 85) rotate(-25)">
        <circle cx="16" cy="16" r="14" fill="url(#goldKey)" stroke="#ca8a04" stroke-width="1.8" />
        <circle cx="16" cy="16" r="6" fill="#f6faee" />
        <!-- Key Stem -->
        <rect x="28" y="13" width="30" height="6" rx="2" fill="url(#goldKey)" stroke="#ca8a04" stroke-width="1.2" />
        <!-- Key Teeth -->
        <rect x="46" y="19" width="5" height="7" rx="1.5" fill="url(#goldKey)" />
        <rect x="53" y="19" width="4" height="9" rx="1.5" fill="url(#goldKey)" />
      </g>

      <!-- Vault / Safe with Green Shield at Bottom -->
      <g transform="translate(60, 110)">
        <!-- Safe Base -->
        <rect x="20" y="30" width="130" height="75" rx="6" fill="#1e3a12" stroke="#365314" stroke-width="2" />
        <!-- Safe Door -->
        <rect x="30" y="38" width="110" height="59" rx="4" fill="#365314" />
        <!-- Shield on Safe Door -->
        <path d="M85 45L105 52V68C105 78 95 86 85 90C75 86 65 78 65 68V52L85 45Z" fill="url(#shieldGrad)" stroke="#a3e635" stroke-width="1.5" />
        <path d="M80 67L84 71L92 62" stroke="#f8fafc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>

    <!-- Variant 3: Coins & Savings vault (Signup) -->
    <svg 
      v-else 
      class="hero-svg" 
      viewBox="0 0 340 220" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldCoin3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="60%" stop-color="#facc15" />
          <stop offset="100%" stop-color="#ca8a04" />
        </linearGradient>
      </defs>

      <!-- Sparkles -->
      <path d="M50 48L52 52L56 54L52 56L50 60L48 56L44 54L48 52Z" fill="#a3e635" />
      <path d="M290 80L292 83L295 84L292 85L290 88L288 85L285 84L288 83Z" fill="#facc15" />

      <!-- Hand dropping gold coin from top -->
      <path d="M290 10C260 30 240 50 215 70C200 82 188 90 180 82C172 74 175 62 185 50C202 32 230 18 270 0L290 10Z" fill="#b45309" />
      <path d="M180 82C174 88 165 92 158 88C152 84 155 75 163 70C170 65 178 68 184 76" fill="#c2410c" />
      <!-- Ring -->
      <ellipse cx="196" cy="64" rx="3.5" ry="6" fill="#facc15" stroke="#ca8a04" stroke-width="1" transform="rotate(35 196 64)" />

      <!-- Coin Dropping -->
      <circle cx="152" cy="106" r="14" fill="url(#goldCoin3)" stroke="#ca8a04" stroke-width="1.6" />
      <text x="152" y="111" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="900" fill="#854d0e" text-anchor="middle">₹</text>
      
      <!-- Cyan Curved Arrow -->
      <path d="M174 98C176 108 174 118 168 126" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M164 124L169 130L174 125" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Stacks of green banknotes on left -->
      <g transform="translate(62, 140)">
        <rect x="0" y="24" width="46" height="42" rx="4" fill="#15803d" />
        <rect x="0" y="18" width="46" height="12" rx="2" fill="#16a34a" />
        <rect x="0" y="12" width="46" height="12" rx="2" fill="#22c55e" />
        <rect x="0" y="6" width="46" height="12" rx="2" fill="#4ade80" />
        <circle cx="23" cy="20" r="4" fill="#15803d" />
        <!-- Stack Coin -->
        <circle cx="48" cy="52" r="11" fill="url(#goldCoin3)" stroke="#ca8a04" stroke-width="1.2" />
        <text x="48" y="56" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="900" fill="#854d0e" text-anchor="middle">₹</text>
      </g>

      <!-- Green Money Box / Vault -->
      <g transform="translate(112, 128)">
        <path d="M0 24L38 12L125 12L88 24H0Z" fill="#365314" />
        <path d="M38 12H125V75H38V12Z" fill="#65a30d" />
        <path d="M0 24H88V80H0V24Z" fill="#4d7c0f" />
        <!-- Decorative waves on box -->
        <path d="M8 36C22 44 42 38 56 46C70 54 78 50 82 56" stroke="#84cc16" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7" />
        <path d="M12 56C28 62 48 56 64 64" stroke="#84cc16" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.illustration-hero {
  position: relative;
  width: 100%;
  height: 220px;
  background: #f6faee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.hero-bg-accent {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  height: 180px;
  background: radial-gradient(circle, rgba(163, 230, 53, 0.22) 0%, rgba(246, 250, 238, 0) 70%);
  pointer-events: none;
}

.hero-svg {
  width: 100%;
  height: 100%;
  max-width: 380px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(20, 38, 11, 0.08));
}

/* Micro-animations */
@keyframes floatGentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes floatKey {
  0%, 100% {
    transform: translate(130px, 85px) rotate(-25deg);
  }
  50% {
    transform: translate(130px, 80px) rotate(-22deg);
  }
}

.float-coin-1 {
  animation: floatGentle 3.5s ease-in-out infinite;
}

.float-coin-2 {
  animation: floatGentle 4s ease-in-out 0.8s infinite;
}

.float-key {
  animation: floatKey 3s ease-in-out infinite;
}
</style>
