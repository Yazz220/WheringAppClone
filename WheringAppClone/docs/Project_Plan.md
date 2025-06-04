### Whering App Clone - Project Plan

**Project Goal:** To recreate the Whering wardrobe-management mobile app pixel by pixel, duplicating its look, feel, and behavior on both iOS and Android, including frontend and backend components as detailed in the Engineering Guide.

**Overall Architecture Vision (from Guide):**

```mermaid
graph LR
    subgraph User Device
        A[React Native App (iOS/Android)]
    end

    subgraph Cloud Backend (Firebase & GCP/Custom)
        B[Firebase Authentication]
        C[Firebase Cloud Firestore (DB)]
        D[Firebase Storage (Images)]
        E[Node.js/Express API (on Cloud Run)]
        F[Firebase Cloud Functions]
    end

    subgraph Third-Party Services
        G[Image Processing (e.g., remove.bg)]
        H[Image Tagging (e.g., Google Vision API)]
        I[Push Notifications (FCM)]
        J[Analytics (Firebase Analytics)]
        K[Weather API (Optional)]
    end

    A -- Auth Requests --> B
    A -- Data CRUD (Direct/Via API) --> C
    A -- Image Uploads/Downloads --> D
    A -- API Calls --> E
    E -- Uses --> C
    E -- Uses --> D
    E -- Calls --> G
    E -- Calls --> H
    F -- Triggered by D, C or Called by A/E --> G
    F -- Triggered by D, C or Called by A/E --> H
    F -- Sends --> I
    A -- Receives --> I
    A -- Sends Data --> J
    E -- Can Call --> K
    A -- Can Call (or via E) --> K
```

**Development Phases & Key Tasks:**

**Phase 0: Project Setup & Foundation (Completed)**
*   Tasks:
    *   Project Initialization & Directory Structure (Completed)
    *   Engineering Guide Ingestion & Progress Log Setup (Completed)
    *   Detailed Project Planning (This step)

**Phase 1: Environment Setup & Core Backend Configuration**
*   **Goal:** Establish the development environment for both frontend and backend, and configure core Firebase services.
*   **Key Tasks (derived from "Setting Up the Development Environment" & "Backend Implementation"):**
    1.  **Prerequisites Installation:**
        *   Install Node.js, npm, Watchman, React Native CLI, Expo CLI (if chosen).
        *   Install Java (JDK), Android Studio (for Android SDK/emulator).
        *   Install Xcode (for iOS development on Mac).
    2.  **Firebase Project Setup:**
        *   Create a Firebase project via the Firebase Console.
        *   Enable Authentication (Email/Password, Google, Apple).
        *   Set up Cloud Firestore (Database).
        *   Set up Firebase Storage (for images).
        *   Enable Firebase Cloud Functions (if planning to use early).
    3.  **Source Repositories Initialization:**
        *   Initialize React Native project (`WheringClone`) with TypeScript.
            *   Decision point: Expo CLI or React Native CLI (Guide suggests either, recommends Expo for ease).
        *   Initialize Node.js backend project (`whering-backend`) with TypeScript and Express.
    4.  **Firebase SDK Integration:**
        *   Frontend: Add and configure Firebase SDKs (`@react-native-firebase/app`, `auth`, `firestore`, `storage` or `firebase` for Expo).
        *   Backend: Install and configure Firebase Admin SDK.
    5.  **Basic Library Installation (Frontend):**
        *   React Navigation and dependencies.
        *   Image Picker library.
        *   Vector Icons library.
        *   Run `pod install` for iOS.
    6.  **API Key & Cloud Service Setup:**
        *   Obtain API keys for `remove.bg` and Google Cloud Vision API.
        *   Securely store API keys (e.g., environment files, secrets manager).
        *   Set up Google Cloud Project (if using Cloud Run for backend later).
*   **Deliverables:**
    *   Functional local development environments for frontend and backend.
    *   Initialized Git repositories.
    *   Firebase project configured with essential services.
    *   Boilerplate React Native app connected to Firebase.
    *   Basic Express backend server setup.

**Phase 2: UI Foundation & Core Navigation**
*   **Goal:** Implement the app's core UI theme, styles, and main navigation structure.
*   **Key Tasks (derived from "Design and Theming" & "Frontend Implementation - Navigation Structure"):**
    1.  **Design System Implementation:**
        *   Define and implement the color palette (primary, neutrals, accents) in a theme file (`theme.ts`).
        *   Integrate and configure the Open Sans font family.
        *   Define typography styles (font sizes, weights for body, headings, labels).
        *   Select and integrate an icon library matching Whering's style.
        *   Establish pixel-perfect layout practices (spacing, margins, consistent component styling).
    2.  **Core Navigation Setup (React Navigation):**
        *   Implement the main Bottom Tab Navigator (e.g., Wardrobe, Planner, Add, Discover, Profile).
        *   Implement Stack Navigators for flows within each tab.
        *   Set up conditional navigation (Auth stack vs. Main app stack based on login state).
        *   Style tab and stack navigators according to Whering's design (icons, colors, titles).
*   **Deliverables:**
    *   A `theme.ts` file with all design constants.
    *   App-wide font and icon integration.
    *   Functional main navigation shell (bottom tabs and initial stack navigators).
    *   App correctly switches between auth flow and main app.

**Phase 3: User Onboarding & Authentication**
*   **Goal:** Implement the complete user onboarding and authentication flow.
*   **Key Tasks (derived from "Frontend Implementation - Onboarding & Authentication"):**
    1.  **Welcome & Login Screen (`WelcomeScreen`):**
        *   UI with branding, Sign Up/Sign In options.
        *   Implement Email/Password Sign In with Firebase Auth.
        *   Implement Google Sign-In with Firebase Auth.
        *   Implement Apple Sign-In with Firebase Auth.
    2.  **Email Sign-Up Screen (`SignUpScreen`):**
        *   Form for email, password, terms agreement.
        *   Input validation.
        *   Firebase Auth `createUserWithEmailAndPassword`.
        *   Error handling.
    3.  **Profile Setup Screens (`UserInfoScreen`, `UsernameScreen`):**
        *   Collect first name, last name, birthdate.
        *   Collect unique username and optional profile picture (upload to Firebase Storage).
        *   Input validation and username availability check (basic).
    4.  **Preferences Questionnaire Screen (`InterestsScreen`):**
        *   Checkbox options for user interests.
        *   Option to enable/disable notifications.
    5.  **Onboarding Completion Logic:**
        *   Save all collected user data to Firestore (`users` collection).
        *   Navigate to the main app, resetting the navigation stack.
    6.  **Backend Support (if needed):**
        *   Endpoint/Cloud Function for username uniqueness check (if not client-side).
        *   Endpoint/Cloud Function for `completeProfile` if complex server-side logic is involved.
*   **Deliverables:**
    *   Fully functional user sign-up (Email, Google, Apple) and sign-in.
    *   Multi-step onboarding flow collecting user profile information and preferences.
    *   User data persisted in Firestore.
    *   Profile pictures uploaded to Firebase Storage.

**Phase 4: Wardrobe Management - Frontend & Backend**
*   **Goal:** Implement features for adding, viewing, and managing wardrobe items.
*   **Key Tasks (derived from "Frontend Implementation - Wardrobe Management" & "Backend Implementation"):**
    1.  **Add Item Flow - Frontend (`AddItemSourceScreen`, `AddItemDetailsScreen`):**
        *   UI for selecting image source (Camera, Library, URL).
        *   Integrate camera and image picker.
        *   UI for item details form (category, brand, color, tags, price).
        *   Handle multiple image uploads and review flow.
    2.  **Image Processing - Backend (Cloud Function / API Endpoint):**
        *   Receive uploaded image.
        *   Integrate `remove.bg` API for background removal.
        *   Integrate Google Vision API for auto-tagging (category, color).
        *   Save processed image and original to Firebase Storage.
        *   Update Firestore item entry with processed image URL and suggested tags.
    3.  **Saving Items - Frontend & Backend:**
        *   Frontend logic to gather item details and initiate save.
        *   Create new item entry in Firestore (`items` collection, possibly sub-collection under user).
    4.  **View Wardrobe - Frontend (`WardrobeScreen`):**
        *   UI with header (user info, item counts).
        *   Category filters (horizontal scroll).
        *   Item grid display (FlatList/SectionList with thumbnails).
        *   Search functionality (client-side or basic Firestore query).
    5.  **Item Details View - Frontend (`ItemDetailsScreen`):**
        *   Display larger image and full item details.
        *   Options to Edit/Delete item (implement corresponding Firestore operations).
    6.  **Database Schema for Items (Firestore):**
        *   Define and implement the `items` collection structure.
    7.  **Security Rules (Firestore & Storage):**
        *   Ensure users can only access/modify their own items and images.
*   **Deliverables:**
    *   Users can add new clothing items with photos.
    *   Backgrounds are automatically removed, and items are auto-tagged (basic).
    *   Users can view their wardrobe, filter by category, and search.
    *   Users can view, edit, and delete item details.
    *   Secure storage and retrieval of item data and images.

**Phase 5: Outfit Creation & Management**
*   **Goal:** Implement the outfit creation canvas and features to save and view outfits.
*   **Key Tasks (derived from "Frontend Implementation - Outfit Creation Canvas"):**
    1.  **Outfit Creation Canvas UI (`OutfitStudioScreen`):**
        *   Canvas area for arranging items.
        *   UI to add items from wardrobe to canvas (modal picker).
        *   Gestures for item manipulation (drag, resize, layer - PanResponder or library).
        *   Option to remove items from canvas.
    2.  **Saving Outfits:**
        *   Capture list of item IDs and their layout data.
        *   Optional: Render canvas to an image (`react-native-view-shot`) and upload to Firebase Storage.
        *   Create new outfit entry in Firestore (`outfits` collection).
    3.  **Viewing Outfits (`WardrobeScreen` toggle or separate screen):**
        *   Grid display of saved outfits (using snapshots or dynamically rendered).
    4.  **Outfit Details View (`OutfitDetailsScreen`):**
        *   Display outfit image/composition.
        *   Options to Edit (re-open in canvas) or Delete outfit.
    5.  **Database Schema for Outfits (Firestore):**
        *   Define and implement the `outfits` collection structure.
*   **Deliverables:**
    *   Functional outfit creation canvas.
    *   Users can save created outfits.
    *   Users can view, edit, and delete their saved outfits.

**Phase 6: Outfit Planner (Calendar Integration)**
*   **Goal:** Implement the calendar feature for scheduling outfits.
*   **Key Tasks (derived from "Frontend Implementation - Outfit Planner"):**
    1.  **Calendar UI (`PlannerScreen`):**
        *   Integrate `react-native-calendars` or similar library.
        *   Display month view with navigation.
        *   Mark dates with planned outfits.
    2.  **Scheduling an Outfit:**
        *   UI to select a date and assign an existing outfit (modal picker).
        *   Option to create a new outfit for a date.
        *   Store calendar events in Firestore (`plans` or `events` collection).
    3.  **Viewing Planned Outfit:**
        *   Display details of the outfit scheduled for a selected date.
        *   Option to remove/change planned outfit.
    4.  **Database Schema for Plans (Firestore):**
        *   Define and implement the `plans` collection structure.
    5.  **(Advanced/Optional) Packing Lists / Trips:**
        *   UI to create multi-day events (trips).
        *   Assign outfits to trip days.
        *   Generate packing list from items in trip outfits.
*   **Deliverables:**
    *   Functional calendar for planning outfits.
    *   Users can assign outfits to specific dates.
    *   Users can view their planned outfits.
    *   (Optional) Basic trip planning and packing list generation.

**Phase 7: Personalization & Recommendations ("Dress Me")**
*   **Goal:** Implement the "Dress Me" outfit suggestion feature and basic wardrobe analytics.
*   **Key Tasks (derived from "Frontend Implementation - Personalization & Recommendations"):**
    1.  **"Dress Me" UI (`DressMeScreen`):**
        *   Card-based display for outfit suggestions.
        *   Controls: Shuffle, Like/Accept, Dislike/Skip.
        *   (Optional) Weather integration display.
    2.  **Outfit Generation Logic (Client-side or Backend Function):**
        *   Simple random algorithm (pick one top, bottom, shoes).
        *   (Optional) Filter by weather or user preferences.
    3.  **"Dress Me" Actions:**
        *   If liked/accepted, option to schedule for today or save outfit.
        *   If disliked/skipped, generate a new suggestion.
    4.  **Wardrobe Stats & Analytics (Basic):**
        *   Calculate and display cost-per-wear (if price and wear count are tracked).
        *   Track item/outfit usage frequency.
        *   Simple stats display on profile or dedicated screen.
*   **Deliverables:**
    *   "Dress Me" feature providing random outfit suggestions.
    *   Basic wardrobe analytics (e.g., cost-per-wear).

**Phase 8: User Profile & Settings**
*   **Goal:** Implement the user profile screen and account settings.
*   **Key Tasks (derived from "Frontend Implementation - User Profile & Settings"):**
    1.  **Profile Screen UI (`ProfileScreen`):**
        *   Display user info (name, username, photo).
        *   Display stats (item count, outfit count).
        *   "Edit Profile" option.
    2.  **Settings Functionality:**
        *   Change password.
        *   Toggle notification preferences.
        *   Help/FAQ, About links.
        *   Sign Out functionality (Firebase Auth `signOut`).
*   **Deliverables:**
    *   Functional user profile screen.
    *   Users can edit basic profile info and manage settings.
    *   Secure sign-out.

**Phase 9: Backend Refinement & Deployment**
*   **Goal:** Finalize backend logic, security, and deploy all components.
*   **Key Tasks (derived from "Backend Implementation" & "Deployment"):**
    1.  **Backend API Finalization:**
        *   Ensure all necessary endpoints are implemented and tested.
        *   Implement robust error handling and input validation.
    2.  **Security Hardening:**
        *   Finalize Firestore security rules.
        *   Secure API endpoints (authentication middleware).
        *   Review and secure Firebase Storage rules.
    3.  **Backend Deployment:**
        *   Deploy Firebase Cloud Functions.
        *   Containerize and deploy Node.js/Express API to Cloud Run (or chosen platform).
        *   Configure production environment variables and secrets.
    4.  **Mobile App Build & Release Preparation:**
        *   Configure app for release (identifiers, icons, splash screen).
        *   Generate release builds (APK/AAB for Android, archive for iOS).
    5.  **App Store / Google Play Setup:**
        *   Create app listings.
        *   Upload builds.
        *   Provide necessary metadata, privacy policy.
        *   Submit for review.
    6.  **Monitoring & Analytics Setup:**
        *   Integrate Firebase Crashlytics.
        *   Set up basic monitoring for backend services.
*   **Deliverables:**
    *   Deployed and functional backend (API, Cloud Functions).
    *   Release-ready mobile application builds.
    *   App store listings initiated.

**Phase 10: Testing, Iteration & Launch**
*   **Goal:** Conduct thorough testing, iterate based on feedback, and prepare for launch.
*   **Key Tasks:**
    1.  **End-to-End Testing:** Test all features on multiple devices (iOS & Android).
    2.  **User Acceptance Testing (UAT):** (If applicable) Gather feedback from test users.
    3.  **Bug Fixing & Performance Optimization.**
    4.  **Final App Store Submissions.**
    5.  **Monitor initial launch and gather user feedback for future iterations.**
*   **Deliverables:**
    *   Stable, tested application live on App Store and Google Play.
    *   Documentation of known issues and future improvements.