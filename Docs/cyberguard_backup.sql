--
-- PostgreSQL database dump
--

\restrict Ahc2Bayg852oJtcKm9TRIooacP0PyDWHnp8K7gZZjyWHKxhWHnhCeIBzrI0QExU

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'STUDENT',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    thumbnail text,
    difficulty text DEFAULT 'Beginner'::text NOT NULL,
    duration text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "enrolledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "videoUrl" text,
    "order" integer NOT NULL,
    "courseId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.progress (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public.progress OWNER TO postgres;

--
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id text NOT NULL,
    "quizId" text NOT NULL,
    question text NOT NULL,
    options text[],
    "correctAnswer" integer NOT NULL,
    "order" integer NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz_attempts (
    id text NOT NULL,
    "userId" text NOT NULL,
    "quizId" text NOT NULL,
    score integer NOT NULL,
    passed boolean NOT NULL,
    "attemptedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.quiz_attempts OWNER TO postgres;

--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quizzes (
    id text NOT NULL,
    "lessonId" text NOT NULL,
    title text NOT NULL,
    "passingScore" integer DEFAULT 70 NOT NULL
);


ALTER TABLE public.quizzes OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    role public."Role" DEFAULT 'STUDENT'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, description, thumbnail, difficulty, duration, "isPublished", "createdAt", "updatedAt") FROM stdin;
8977f516-b50b-4e28-82c6-8334d32565ce	Password Security Best Practices	Master the art of creating and managing secure passwords. Learn about password managers, multi-factor authentication, and common password attacks.	https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400	Beginner	1.5 hours	t	2026-01-14 20:19:11.746	2026-01-14 20:19:11.746
16af8715-49e2-4c20-a5d1-ff21a5edbca4	Phishing Detection Fundamentals	Learn to identify and protect yourself from phishing attacks. This course covers email phishing, spear phishing, and social engineering tactics used by attackers.	https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400	Beginner	2 hours	t	2026-01-14 20:19:11.746	2026-01-14 20:19:11.746
291632ce-9cd9-46ea-8bf1-1c18454848f4	Social Engineering Awareness	Understand how attackers manipulate human psychology to bypass security. Learn to recognize and defend against social engineering tactics.	https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400	Intermediate	2.5 hours	t	2026-01-14 20:19:11.747	2026-01-14 20:19:11.747
9abe5524-4c3f-4e6e-b920-c7c6c56eb281	Personal Data Protection	Protect your personal and sensitive data from theft and exposure. Learn about data classification, encryption, and secure data handling.	https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400	Intermediate	2 hours	t	2026-01-14 20:19:11.747	2026-01-14 20:19:11.747
457ed218-eabe-4114-87b1-e3c22cf21377	Secure Web Browsing	Learn how to browse the internet safely. Understand browser security, recognize malicious websites, and protect your privacy online.	https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400	Beginner	1.5 hours	t	2026-01-14 20:19:11.747	2026-01-14 20:19:11.747
7a257ab0-cee8-48c7-8def-e87ec47237e2	Advanced Threat Analysis & Incident Response	Master advanced cybersecurity techniques including threat hunting, incident response, and forensic analysis. Learn to identify, analyze, and respond to sophisticated cyber attacks.	https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400	Advanced	4 hours	t	2026-01-14 22:45:06.416	2026-01-14 23:32:48.687
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") FROM stdin;
d9eb1c5b-e841-467e-ba5c-32a19cf4f8bf	5c4b9d83-5601-43c9-863e-8e057d453ebf	16af8715-49e2-4c20-a5d1-ff21a5edbca4	2026-01-14 20:19:11.852	\N
96f7558f-930f-43bc-81b7-95088bde8f62	5c4b9d83-5601-43c9-863e-8e057d453ebf	8977f516-b50b-4e28-82c6-8334d32565ce	2026-01-14 20:19:11.852	\N
4d4d78f5-18b6-4035-9a25-d120cf386e5a	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	16af8715-49e2-4c20-a5d1-ff21a5edbca4	2025-12-03 14:00:00	2025-12-15 18:30:00
73740230-2aea-4cd1-b9bf-237b168bb326	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	8977f516-b50b-4e28-82c6-8334d32565ce	2025-12-10 09:30:00	\N
6063a674-8e7b-4acd-b3a2-292d44dcc045	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	291632ce-9cd9-46ea-8bf1-1c18454848f4	2025-12-20 16:45:00	\N
ca3c52c0-b20a-40fd-8769-3857670eac43	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	291632ce-9cd9-46ea-8bf1-1c18454848f4	2026-01-14 20:47:42.818	\N
80f2dfe2-1c78-429b-a125-80aa7b05685d	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	9abe5524-4c3f-4e6e-b920-c7c6c56eb281	2026-01-14 20:52:03.132	2026-01-14 20:52:25.789
75ff0444-5302-47da-bebf-5b8526ffae7a	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	9abe5524-4c3f-4e6e-b920-c7c6c56eb281	2026-01-14 21:19:28.878	\N
0f8b45b4-0da4-449c-92e1-0f59a560c5a0	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	457ed218-eabe-4114-87b1-e3c22cf21377	2026-01-05 11:00:00	2026-01-14 21:51:49.631
417e00ca-4231-4e67-b4a2-905073e876e0	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	7a257ab0-cee8-48c7-8def-e87ec47237e2	2026-01-14 22:46:01.33	\N
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt") FROM stdin;
b95e09ae-456f-4a4f-ba4a-71bb5f654251	Creating Strong Passwords	# How to Create Unbreakable Passwords\n\n## Password Strength Factors\n\n### Length is King\n- **Minimum 12 characters**, 16+ is better\n- Each additional character exponentially increases security\n- "correcthorsebatterystaple" > "Tr0ub4dor&3"\n\n### Complexity Matters (But Less Than You Think)\n- Mix uppercase, lowercase, numbers, symbols\n- Avoid predictable patterns (Password1!, Qwerty123)\n- Don't just add numbers/symbols at the end\n\n## Password Creation Methods\n\n### Passphrase Method\nCreate a sentence only you would know:\n- "MyDogAte3BluePancakesIn2024!"\n- "IMetMyWife@CoffeeShop#7"\n- Easy to remember, hard to crack\n\n### Random Generator Method\nUse a password manager to generate:\n- "xK9#mP2$vL5@nQ8"\n- Maximum entropy\n- Requires a password manager\n\n### Diceware Method\n- Roll dice to select random words\n- "correct-horse-battery-staple"\n- Highly secure and memorable\n\n## What NOT to Do\n\n❌ Personal information (birthdays, names, pets)\n❌ Dictionary words alone\n❌ Keyboard patterns (qwerty, 12345)\n❌ Common substitutions everyone knows (@ for a, 0 for o)\n❌ The same password everywhere\n❌ Passwords shorter than 12 characters	\N	2	8977f516-b50b-4e28-82c6-8334d32565ce	2026-01-14 20:19:11.746	2026-01-14 20:19:11.746
b14c261b-dabd-4564-8458-3715dad36083	Password Managers & MFA	# Tools for Password Security\n\n## Password Managers\n\n### What They Do\n- Generate strong, unique passwords\n- Securely store all your passwords\n- Auto-fill login forms\n- Sync across devices\n\n### Recommended Password Managers\n- **Bitwarden** (Free, open-source)\n- **1Password** (Paid, excellent features)\n- **Dashlane** (Paid, user-friendly)\n- **KeePass** (Free, local storage)\n\n### Best Practices\n- Use a very strong master password\n- Enable MFA on your password manager\n- Regular backups\n- Never share your master password\n\n## Multi-Factor Authentication (MFA)\n\n### What is MFA?\nSomething you:\n1. **Know** (password)\n2. **Have** (phone, security key)\n3. **Are** (fingerprint, face)\n\n### Types of MFA\n\n#### Authenticator Apps (Recommended)\n- Google Authenticator\n- Microsoft Authenticator\n- Authy\n\n#### Hardware Security Keys (Most Secure)\n- YubiKey\n- Google Titan\n- Feitian\n\n#### SMS Codes (Better Than Nothing)\n- Vulnerable to SIM swapping\n- Use only if no other option\n\n### Enable MFA Everywhere\nPriority accounts:\n1. Email (gateway to all other accounts)\n2. Banking and financial\n3. Social media\n4. Work accounts\n5. Password manager	\N	3	8977f516-b50b-4e28-82c6-8334d32565ce	2026-01-14 20:19:11.746	2026-01-14 20:19:11.746
2d459bce-c4b2-48bc-9e57-fa84e903288a	Introduction to Phishing	# What is Phishing?\n\nPhishing is a type of social engineering attack where attackers attempt to trick you into revealing sensitive information such as passwords, credit card numbers, or personal data.\n\n## How Phishing Works\n\n1. **Bait**: Attackers create convincing fake emails, websites, or messages\n2. **Hook**: They use urgency, fear, or curiosity to get you to act\n3. **Catch**: You unknowingly provide sensitive information\n\n## Common Types of Phishing\n\n- **Email Phishing**: Mass emails pretending to be from legitimate companies\n- **Spear Phishing**: Targeted attacks on specific individuals\n- **Whaling**: Attacks targeting executives and high-profile individuals\n- **Smishing**: Phishing via SMS text messages\n- **Vishing**: Voice phishing via phone calls\n\n## Why It Matters\n\nPhishing is responsible for over 90% of data breaches. Understanding how to identify these attacks is crucial for personal and organizational security.	https://www.youtube.com/watch?v=XBkzBrXlle0	1	16af8715-49e2-4c20-a5d1-ff21a5edbca4	2026-01-14 20:19:11.746	2026-01-14 21:38:58.884
4ee8c7e2-3b83-4a45-bfbe-c1f9ec311f77	Protecting Yourself from Phishing	# Best Practices for Phishing Prevention\n\n## Technical Safeguards\n\n### Enable Multi-Factor Authentication (MFA)\n- Adds an extra layer of security\n- Even if passwords are stolen, attackers can't access accounts\n- Use authenticator apps over SMS when possible\n\n### Keep Software Updated\n- Install security patches promptly\n- Use automatic updates when available\n- Keep browsers and email clients current\n\n### Use Email Filtering\n- Enable spam filters\n- Use email authentication (SPF, DKIM, DMARC)\n- Consider advanced threat protection\n\n## Behavioral Safeguards\n\n### Verify Before You Trust\n- When in doubt, contact the sender through official channels\n- Don't use contact info from suspicious emails\n- Look up official phone numbers independently\n\n### Think Before You Click\n- Hover over links to preview URLs\n- Type URLs directly into your browser\n- Be suspicious of shortened URLs\n\n### Protect Your Information\n- Never share passwords via email\n- Legitimate companies won't ask for sensitive data via email\n- Use unique passwords for each account\n\n## If You've Been Phished\n\n1. **Change your passwords immediately**\n2. **Enable MFA on all accounts**\n3. **Monitor your accounts for suspicious activity**\n4. **Report the incident to your IT department**\n5. **Consider a credit freeze if financial data was exposed**	\N	3	16af8715-49e2-4c20-a5d1-ff21a5edbca4	2026-01-14 20:19:11.746	2026-01-14 20:19:11.746
7c8bb8da-7da9-4c6a-89be-a66e094e9c51	Common Social Engineering Attacks	# Types of Social Engineering Attacks\n\n## Pretexting\n\nCreating a fabricated scenario to extract information.\n\n**Examples:**\n- IT support calling to "fix" your computer\n- Bank representative verifying your account\n- Recruiter requesting personal details\n\n**Defense:** Always verify identity through official channels\n\n## Baiting\n\nOffering something enticing to deliver malware.\n\n**Examples:**\n- USB drives left in parking lots\n- Free software downloads\n- "You've won!" pop-ups\n\n**Defense:** Never plug in unknown devices or download from untrusted sources\n\n## Quid Pro Quo\n\nOffering a service in exchange for information.\n\n**Examples:**\n- Free security audit that installs malware\n- Technical support in exchange for credentials\n- Survey with a prize requiring personal data\n\n**Defense:** Be skeptical of unsolicited offers\n\n## Tailgating/Piggybacking\n\nPhysically following authorized personnel into restricted areas.\n\n**Examples:**\n- Holding the door for someone with "full hands"\n- Wearing a fake badge or uniform\n- Claiming to be a vendor or delivery person\n\n**Defense:** Always verify and badge everyone, even if awkward\n\n## Vishing (Voice Phishing)\n\nPhone-based social engineering.\n\n**Examples:**\n- IRS scam calls\n- Tech support scams\n- Bank fraud department impersonation\n\n**Defense:** Hang up and call back on official numbers	\N	2	291632ce-9cd9-46ea-8bf1-1c18454848f4	2026-01-14 20:19:11.747	2026-01-14 20:19:11.747
972de6b3-7b57-4e00-a338-dab4541cfec0	Defending Against Social Engineering	# How to Protect Yourself\n\n## Personal Defense Strategies\n\n### Verify, Verify, Verify\n- Always confirm identities through official channels\n- Don't use contact info provided by the requester\n- When in doubt, hang up and call back\n\n### Slow Down\n- Urgency is a red flag\n- Take time to think before acting\n- It's okay to say "let me get back to you"\n\n### Limit Information Sharing\n- Be cautious on social media\n- Don't overshare at work or in public\n- Shred sensitive documents\n\n### Trust Your Instincts\n- If something feels wrong, it probably is\n- It's better to be rude than compromised\n- Report suspicious interactions\n\n## Organizational Defense\n\n### Security Awareness Training\n- Regular training for all employees\n- Simulated phishing exercises\n- Clear reporting procedures\n\n### Policies and Procedures\n- Verification protocols for sensitive requests\n- Clean desk policy\n- Visitor management\n\n### Technical Controls\n- Email filtering\n- Multi-factor authentication\n- Access controls\n\n## When You Suspect an Attack\n\n1. **Stop** - Don't provide any more information\n2. **Document** - Note details of the interaction\n3. **Report** - Contact security/IT immediately\n4. **Learn** - Share the experience to help others\n\nRemember: There's no shame in being targeted. Attackers are professionals. The shame is in not reporting it.	\N	3	291632ce-9cd9-46ea-8bf1-1c18454848f4	2026-01-14 20:19:11.747	2026-01-14 20:19:11.747
58ba3e11-ac96-4aaa-855c-7ec6149a6004	Understanding Data Classification	# What Data Needs Protection?\n\n## Types of Sensitive Data\n\n### Personal Identifiable Information (PII)\n- Full name\n- Social Security Number\n- Date of birth\n- Address\n- Phone number\n- Email address\n\n### Financial Information\n- Credit card numbers\n- Bank account details\n- Tax information\n- Investment records\n\n### Health Information\n- Medical records\n- Insurance information\n- Prescription data\n- Health conditions\n\n### Authentication Data\n- Passwords\n- Security questions\n- Biometric data\n- PINs\n\n## Data Classification Levels\n\n### Public\n- Information that can be freely shared\n- Marketing materials, public announcements\n\n### Internal\n- Not for public distribution\n- Internal memos, policies\n\n### Confidential\n- Limited access required\n- Customer data, financial reports\n\n### Restricted\n- Highest protection needed\n- Trade secrets, PII, credentials\n\n## Why Classification Matters\n\n- Helps prioritize protection efforts\n- Guides appropriate handling procedures\n- Ensures compliance with regulations\n- Reduces risk of data breaches	https://www.youtube.com/watch?v=wt1HwxaCx3U	1	9abe5524-4c3f-4e6e-b920-c7c6c56eb281	2026-01-14 20:19:11.747	2026-01-14 21:38:58.9
55723186-696b-4c7e-b260-7fb5613ad5bc	Data Protection Best Practices	# Protecting Your Data\n\n## Physical Security\n\n### Secure Your Devices\n- Never leave devices unattended\n- Use cable locks for laptops\n- Enable auto-lock with short timeout\n- Encrypt device storage\n\n### Document Handling\n- Shred sensitive documents\n- Use secure disposal bins\n- Don't leave papers on desks\n- Lock filing cabinets\n\n## Digital Security\n\n### Encryption\n- Encrypt sensitive files before sharing\n- Use full-disk encryption\n- Encrypt cloud storage\n- Use encrypted messaging apps\n\n### Access Control\n- Use strong, unique passwords\n- Enable multi-factor authentication\n- Review app permissions regularly\n- Revoke access when no longer needed\n\n### Secure Sharing\n- Use secure file sharing services\n- Set expiration dates on shared links\n- Use password protection for sensitive files\n- Verify recipient before sending\n\n## Data Minimization\n\n### Collect Only What You Need\n- Question data collection requests\n- Provide minimum required information\n- Use aliases when possible\n\n### Delete What You Don't Need\n- Regularly review stored data\n- Securely delete old files\n- Clear browser history and cache\n- Empty trash/recycle bin securely	\N	2	9abe5524-4c3f-4e6e-b920-c7c6c56eb281	2026-01-14 20:19:11.747	2026-01-14 20:19:11.747
04797532-b6c9-4718-ae24-1ddfb697f5e8	Responding to Data Breaches	# What to Do When Data is Compromised\n\n## Recognizing a Breach\n\n### Warning Signs\n- Unexpected password reset emails\n- Unfamiliar account activity\n- Credit card charges you didn't make\n- Notifications from breach monitoring services\n- Strange emails from your accounts\n\n## Immediate Response\n\n### Step 1: Contain the Damage\n- Change passwords immediately\n- Enable MFA if not already active\n- Log out of all sessions\n- Revoke suspicious app access\n\n### Step 2: Assess the Impact\n- What data was exposed?\n- Which accounts are affected?\n- Is financial information at risk?\n- Was it personal or work-related?\n\n### Step 3: Notify Relevant Parties\n- Report to IT/security team (for work)\n- Contact financial institutions\n- File reports with authorities if needed\n- Notify affected individuals\n\n## Recovery Actions\n\n### Financial Protection\n- Place fraud alerts on credit reports\n- Consider credit freeze\n- Monitor accounts closely\n- Report fraudulent charges\n\n### Identity Protection\n- Monitor for identity theft signs\n- Consider identity monitoring services\n- Keep records of all incidents\n- File FTC identity theft report if needed\n\n### Future Prevention\n- Review how the breach occurred\n- Implement stronger security measures\n- Update passwords across accounts\n- Enable additional security features\n\n## Document Everything\n- Keep a timeline of events\n- Save all correspondence\n- Document financial losses\n- Record time spent on recovery	\N	3	9abe5524-4c3f-4e6e-b920-c7c6c56eb281	2026-01-14 20:19:11.747	2026-01-14 20:19:11.747
71e3f1fe-e298-4aa7-8841-b8495b31edb1	Recognizing Malicious Websites	# How to Identify Dangerous Websites\n\n## URL Red Flags\n\n### Check the Domain Carefully\n- **Typosquatting**: amaz0n.com, goggle.com\n- **Subdomain tricks**: amazon.fakesite.com\n- **Similar characters**: arnazon.com (rn looks like m)\n\n### Verify HTTPS\n- Padlock icon should be present\n- Click the padlock to verify certificate\n- "Not Secure" warning = proceed with caution\n\n### Watch for Suspicious TLDs\n- Be cautious with unusual extensions\n- .xyz, .top, .click are often used by scammers\n- Legitimate companies usually use .com, .org, .net\n\n## Website Content Red Flags\n\n### Poor Design Quality\n- Broken images or layouts\n- Spelling and grammar errors\n- Mismatched branding\n\n### Too Good to Be True\n- Unrealistic prices or offers\n- Countdown timers creating urgency\n- Pop-ups that won't close\n\n### Missing Information\n- No contact information\n- No privacy policy\n- No physical address\n\n## Before You Enter Information\n\n1. Verify the URL matches the expected site\n2. Check for HTTPS and valid certificate\n3. Look for trust signals (reviews, security badges)\n4. When in doubt, navigate directly to the site instead of clicking links	\N	2	457ed218-eabe-4114-87b1-e3c22cf21377	2026-01-14 20:19:11.747	2026-01-14 20:19:11.747
dfc9b8a4-b48e-46fc-9020-1a48fa38cfb6	Safe Downloading Practices	# Downloading Files Safely\n\n## Before You Download\n\n### Verify the Source\n- Download from official websites only\n- Check URL carefully for legitimacy\n- Avoid "download" sites that aggregate software\n\n### Check File Reputation\n- Search for reviews and reports\n- Use VirusTotal to scan files\n- Be wary of newly created software\n\n## During Download\n\n### Watch for Bundled Software\n- Use custom/advanced installation options\n- Uncheck pre-selected additional software\n- Read each installation screen carefully\n\n### File Type Awareness\n- Be cautious with executable files (.exe, .msi, .dmg)\n- Documents can contain macros (.docm, .xlsm)\n- Archives can hide dangerous files (.zip, .rar)\n\n## After Download\n\n### Scan Before Opening\n- Use antivirus to scan downloaded files\n- Don't disable security warnings\n- Quarantine suspicious files\n\n### Verify Integrity\n- Check file hashes when provided\n- Compare file size to expected size\n- Be suspicious of files that are much smaller/larger\n\n## Safe Download Checklist\n\n✅ Official website or trusted source\n✅ HTTPS connection\n✅ File type is expected\n✅ Scanned by antivirus\n✅ No bundled software accepted\n✅ Permissions make sense for the software	\N	3	457ed218-eabe-4114-87b1-e3c22cf21377	2026-01-14 20:19:11.747	2026-01-14 20:19:11.747
c694527e-9d02-489d-8166-27444dedd4ce	Why Password Security Matters	# The Importance of Strong Passwords\n\n## The Current Threat Landscape\n\n- **81%** of data breaches involve weak or stolen passwords\n- The average person has **100+** online accounts\n- Password attacks are automated and run 24/7\n\n## Common Password Attacks\n\n### Brute Force Attacks\n- Systematically trying every possible combination\n- Modern computers can try billions of combinations per second\n- Short passwords can be cracked in seconds\n\n### Dictionary Attacks\n- Using lists of common words and passwords\n- "password123" is tried within milliseconds\n- Includes common substitutions (p@ssw0rd)\n\n### Credential Stuffing\n- Using stolen username/password pairs from data breaches\n- Automated testing across multiple sites\n- Why password reuse is dangerous\n\n### Social Engineering\n- Tricking users into revealing passwords\n- Fake password reset pages\n- Shoulder surfing\n\n## The Cost of Weak Passwords\n\n- Financial loss\n- Identity theft\n- Reputation damage\n- Loss of personal data\n- Business disruption	https://www.youtube.com/watch?v=3NjQ9b3pgIg	1	8977f516-b50b-4e28-82c6-8334d32565ce	2026-01-14 20:19:11.746	2026-01-14 21:38:58.892
60c10db1-79f6-48e3-8274-e46c870e6738	Browser Security Basics	# Understanding Browser Security\n\n## Your Browser is a Gateway\n\nYour web browser is your primary interface with the internet. It's also a primary target for attackers.\n\n## Essential Browser Security Settings\n\n### Keep Your Browser Updated\n- Updates patch security vulnerabilities\n- Enable automatic updates\n- Restart your browser regularly to apply updates\n\n### Use HTTPS Everywhere\n- Look for the padlock icon\n- Avoid sites without HTTPS for sensitive activities\n- Consider browser extensions that enforce HTTPS\n\n### Manage Cookies and Tracking\n- Clear cookies regularly\n- Use private/incognito mode for sensitive browsing\n- Consider cookie management extensions\n\n### Control Pop-ups and Redirects\n- Enable pop-up blocking\n- Be wary of unexpected redirects\n- Don't allow notifications from untrusted sites\n\n## Browser Extensions\n\n### Helpful Security Extensions\n- **uBlock Origin**: Ad and tracker blocking\n- **HTTPS Everywhere**: Force secure connections\n- **Privacy Badger**: Block invisible trackers\n\n### Extension Safety\n- Only install from official stores\n- Check permissions requested\n- Fewer extensions = smaller attack surface\n- Remove extensions you don't use	https://www.youtube.com/watch?v=_p-LNLv49Ug	1	457ed218-eabe-4114-87b1-e3c22cf21377	2026-01-14 20:19:11.747	2026-01-14 21:38:58.897
6ec8b5cb-4ba6-4440-8a81-928790ba19a3	Recognizing Phishing Emails	# How to Spot a Phishing Email\n\n## Red Flags to Watch For\n\n### 1. Suspicious Sender Address\n- Check the actual email address, not just the display name\n- Look for misspellings: "support@amaz0n.com" vs "support@amazon.com"\n- Be wary of public email domains for business communications\n\n### 2. Generic Greetings\n- "Dear Customer" instead of your actual name\n- "Dear User" or "Dear Account Holder"\n\n### 3. Urgency and Threats\n- "Your account will be suspended in 24 hours!"\n- "Immediate action required!"\n- "You've been compromised!"\n\n### 4. Suspicious Links\n- Hover over links before clicking\n- Check if the URL matches the supposed sender\n- Look for HTTPS and valid certificates\n\n### 5. Poor Grammar and Spelling\n- Professional companies proofread their communications\n- Multiple errors suggest a scam\n\n### 6. Unexpected Attachments\n- Never open attachments you weren't expecting\n- Be especially wary of .exe, .zip, or macro-enabled documents\n\n## What To Do\n\n1. Don't click any links or download attachments\n2. Report the email to your IT department\n3. Delete the email\n4. If unsure, contact the company directly through official channels	https://www.youtube.com/watch?v=Y7zNlEMDmI4	2	16af8715-49e2-4c20-a5d1-ff21a5edbca4	2026-01-14 20:19:11.746	2026-01-14 21:38:58.889
de5f6325-6835-4474-8d7c-f2621e5d40f6	Understanding Social Engineering	# The Human Element of Security\n\n## What is Social Engineering?\n\nSocial engineering is the art of manipulating people into giving up confidential information or taking actions that compromise security. It exploits human psychology rather than technical vulnerabilities.\n\n## Why It Works\n\n### Psychological Principles Exploited\n\n**Authority**\n- People tend to comply with authority figures\n- Attackers impersonate IT staff, executives, or officials\n\n**Urgency**\n- Creating time pressure prevents careful thinking\n- "Act now or face consequences!"\n\n**Fear**\n- Threatening job loss, legal action, or account suspension\n- Panic leads to poor decisions\n\n**Trust**\n- Building rapport before the attack\n- Exploiting existing relationships\n\n**Reciprocity**\n- Doing a small favor first\n- "I helped you, now help me"\n\n**Social Proof**\n- "Everyone else has done this"\n- Using fake testimonials or references\n\n## The Attack Lifecycle\n\n1. **Research**: Gathering information about the target\n2. **Develop Trust**: Building a relationship or credible story\n3. **Exploit**: Making the request or launching the attack\n4. **Exit**: Covering tracks and avoiding detection	https://www.youtube.com/watch?v=lc7scxvKQOo	1	291632ce-9cd9-46ea-8bf1-1c18454848f4	2026-01-14 20:19:11.747	2026-01-14 21:38:58.894
06c6fd0e-b1b7-4e54-a543-8dfa8384d060	Incident Response Methodology	# Professional Incident Response\n\n## The Incident Response Lifecycle\n\n### NIST Incident Response Framework\n\n**Phase 1: Preparation**\n- Establish incident response team\n- Define roles and responsibilities\n- Develop playbooks and procedures\n- Acquire and maintain tools\n- Conduct training and exercises\n\n**Phase 2: Detection & Analysis**\n- Monitor security events\n- Analyze alerts and anomalies\n- Determine incident scope\n- Document findings\n- Prioritize response efforts\n\n**Phase 3: Containment, Eradication & Recovery**\n- Short-term containment (stop bleeding)\n- Evidence preservation\n- Long-term containment (sustainable fix)\n- Eradication of threat\n- System recovery and validation\n- Return to normal operations\n\n**Phase 4: Post-Incident Activity**\n- Lessons learned meeting\n- Update procedures and controls\n- Report to stakeholders\n- Improve detection capabilities\n\n## Incident Severity Classification\n\n### Severity Levels\n\n**Critical (P1)**\n- Active data breach in progress\n- Ransomware spreading across network\n- Complete system compromise\n- Regulatory notification required\n- Response: Immediate, all-hands\n\n**High (P2)**\n- Confirmed malware infection\n- Unauthorized access detected\n- Sensitive data at risk\n- Response: Within 1 hour\n\n**Medium (P3)**\n- Suspicious activity detected\n- Policy violation\n- Potential security incident\n- Response: Within 4 hours\n\n**Low (P4)**\n- Security alerts requiring investigation\n- Minor policy violations\n- Response: Within 24 hours\n\n## Evidence Collection & Handling\n\n### Order of Volatility\nCollect in this order (most to least volatile):\n1. Registers and cache\n2. RAM/Memory\n3. Network state\n4. Running processes\n5. Disk/storage\n6. Remote logging data\n7. Physical configuration\n8. Backup media\n\n### Chain of Custody\n- Document who collected what\n- Record timestamps\n- Use write blockers\n- Calculate and record hashes\n- Secure storage\n- Limit access to authorized personnel\n\n## Communication During Incidents\n\n### Internal Communication\n- Establish secure communication channels\n- Regular status updates\n- Clear escalation paths\n- Decision documentation\n\n### External Communication\n- Legal and PR involvement\n- Regulatory notifications\n- Customer/stakeholder communication\n- Law enforcement coordination	\N	2	7a257ab0-cee8-48c7-8def-e87ec47237e2	2026-01-14 22:45:06.416	2026-01-14 22:45:06.416
b67dca25-c889-45cb-9dc5-068b1aa32a03	Forensic Analysis & Threat Hunting	# Advanced Analysis Techniques\n\n## Digital Forensics Fundamentals\n\n### Forensic Principles\n- **Integrity**: Never modify original evidence\n- **Chain of Custody**: Document everything\n- **Reproducibility**: Others can verify findings\n- **Documentation**: Detailed notes and reports\n\n### Key Forensic Artifacts\n\n**Windows Systems**\n- Event Logs (Security, System, Application)\n- Registry hives\n- Prefetch files\n- NTFS artifacts ($MFT, $UsnJrnl)\n- Browser artifacts\n- Memory dumps\n\n**Linux Systems**\n- Auth logs (/var/log/auth.log)\n- Syslog (/var/log/syslog)\n- Bash history\n- Cron jobs\n- Process information\n\n**Network Forensics**\n- Packet captures (PCAP)\n- NetFlow data\n- DNS logs\n- Proxy logs\n- Firewall logs\n\n## Threat Hunting\n\n### What is Threat Hunting?\nProactively searching for threats that have evaded existing security controls.\n\n### Hunting Methodologies\n\n**Hypothesis-Driven Hunting**\n1. Develop hypothesis based on threat intel\n2. Determine data sources needed\n3. Create detection queries\n4. Analyze results\n5. Refine and iterate\n\n**IOC-Based Hunting**\n- Search for known bad indicators\n- Hash values\n- IP addresses\n- Domain names\n- File paths\n\n**Anomaly-Based Hunting**\n- Establish baselines\n- Look for deviations\n- Investigate outliers\n- Statistical analysis\n\n### Essential Hunting Queries\n\n**Unusual Process Execution**\n- Processes running from temp folders\n- Unsigned executables\n- Processes with network connections\n\n**Persistence Mechanisms**\n- New scheduled tasks\n- Registry run keys\n- New services\n- Startup folder additions\n\n**Lateral Movement Indicators**\n- Remote execution tools (PsExec, WMI)\n- RDP connections\n- Admin share access\n- Pass-the-hash patterns\n\n## Building a Threat Hunting Program\n\n### Key Elements\n1. **People**: Skilled analysts with diverse backgrounds\n2. **Process**: Documented methodologies and playbooks\n3. **Technology**: SIEM, EDR, network visibility tools\n4. **Intelligence**: Threat feeds, industry reports\n\n### Metrics for Success\n- Number of hunts conducted\n- Threats discovered\n- Mean time to detect (MTTD)\n- Mean time to respond (MTTR)\n- Coverage of ATT&CK techniques\n\n## Advanced Detection Engineering\n\n### Detection-as-Code\n- Version control for detection rules\n- Testing and validation pipelines\n- Automated deployment\n- Performance monitoring\n\n### SIGMA Rules\n- Vendor-agnostic detection format\n- Community-driven rule sharing\n- Converts to platform-specific queries\n\n### Reducing False Positives\n- Baseline normal behavior\n- Contextual enrichment\n- Tuning thresholds\n- Whitelisting known-good	\N	3	7a257ab0-cee8-48c7-8def-e87ec47237e2	2026-01-14 22:45:06.416	2026-01-14 22:45:06.416
f7babb50-388a-49d0-bdac-ca0b82576820	Threat Intelligence & Attack Frameworks	# Understanding Advanced Threats\n\n## The Evolving Threat Landscape\n\nModern cyber threats have evolved far beyond simple malware. Today's attackers use sophisticated techniques that require equally sophisticated defenses.\n\n## Advanced Persistent Threats (APTs)\n\n### Characteristics of APTs\n- **Persistence**: Attackers maintain long-term access to networks\n- **Stealth**: Use of advanced evasion techniques\n- **Targeted**: Focus on specific organizations or sectors\n- **Resourced**: Often state-sponsored or well-funded criminal groups\n\n### APT Attack Phases\n1. **Reconnaissance**: Gathering information about targets\n2. **Initial Compromise**: Gaining first foothold\n3. **Establish Foothold**: Installing backdoors\n4. **Escalate Privileges**: Gaining admin access\n5. **Internal Reconnaissance**: Mapping the network\n6. **Lateral Movement**: Moving to other systems\n7. **Data Exfiltration**: Stealing valuable data\n8. **Maintain Presence**: Ensuring continued access\n\n## MITRE ATT&CK Framework\n\n### What is ATT&CK?\nA globally accessible knowledge base of adversary tactics and techniques based on real-world observations.\n\n### Key Components\n\n**Tactics** (The "Why")\n- Initial Access\n- Execution\n- Persistence\n- Privilege Escalation\n- Defense Evasion\n- Credential Access\n- Discovery\n- Lateral Movement\n- Collection\n- Exfiltration\n- Impact\n\n**Techniques** (The "How")\n- Specific methods attackers use\n- Sub-techniques for detailed categorization\n- Mapped to real threat groups\n\n### Using ATT&CK for Defense\n- Map your security controls to the framework\n- Identify gaps in coverage\n- Prioritize security investments\n- Develop detection strategies\n\n## Indicators of Compromise (IOCs)\n\n### Types of IOCs\n- **Hash Values**: MD5, SHA1, SHA256 of malicious files\n- **IP Addresses**: Known malicious IPs\n- **Domain Names**: C2 servers, phishing domains\n- **URLs**: Specific malicious URLs\n- **Email Addresses**: Attacker email addresses\n- **File Paths**: Common malware locations\n- **Registry Keys**: Persistence mechanisms\n\n### IOC Lifecycle\n1. Discovery through analysis\n2. Validation and correlation\n3. Sharing with threat intel community\n4. Aging and eventual retirement	https://www.youtube.com/watch?v=pcclNdwG8Vs	1	7a257ab0-cee8-48c7-8def-e87ec47237e2	2026-01-14 22:45:06.416	2026-01-14 23:01:29.794
\.


--
-- Data for Name: progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.progress (id, "userId", "lessonId", completed, "completedAt") FROM stdin;
1ea7f0ff-fb9a-4f96-9696-7d11a9918e28	5c4b9d83-5601-43c9-863e-8e057d453ebf	2d459bce-c4b2-48bc-9e57-fa84e903288a	t	2026-01-14 20:19:11.859
5725125d-d44c-43e1-85fd-11d3d7e1b64a	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	2d459bce-c4b2-48bc-9e57-fa84e903288a	t	2025-12-05 15:30:00
b01b41bf-ed8b-40b4-92a1-cf532db81946	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	6ec8b5cb-4ba6-4440-8a81-928790ba19a3	t	2025-12-08 10:15:00
6e261c12-7000-4e9f-a83a-69e24991c01a	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	4ee8c7e2-3b83-4a45-bfbe-c1f9ec311f77	t	2025-12-15 18:00:00
31af1c95-f537-4cd9-b6e4-33b370569a88	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	c694527e-9d02-489d-8166-27444dedd4ce	t	2025-12-12 14:00:00
8603fbd9-7051-474c-94ee-4aa23a4b48e9	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	b95e09ae-456f-4a4f-ba4a-71bb5f654251	t	2025-12-18 11:30:00
9560151e-7633-4923-9dec-e73f7417fb6b	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	de5f6325-6835-4474-8d7c-f2621e5d40f6	t	2025-12-28 09:45:00
25ac65f6-7f44-4a96-8856-2f4f3f8e0239	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	58ba3e11-ac96-4aaa-855c-7ec6149a6004	t	2026-01-14 20:52:17.244
535b66fc-f348-42fb-a8d7-a50eb7b98f01	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	55723186-696b-4c7e-b260-7fb5613ad5bc	t	2026-01-14 20:52:23.055
6df5c6fb-9823-4ac7-83dd-bf898efbcd88	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	04797532-b6c9-4718-ae24-1ddfb697f5e8	t	2026-01-14 20:52:25.784
65747a54-1ca6-414e-a292-0fb11c94ffb3	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	972de6b3-7b57-4e00-a338-dab4541cfec0	t	2026-01-14 21:00:07.839
80ad452e-ce68-4bf9-ba36-982456f94dbe	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	58ba3e11-ac96-4aaa-855c-7ec6149a6004	t	2026-01-14 21:41:43.474
8420c15b-c0c1-4811-aed4-b9dd520b2c24	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	55723186-696b-4c7e-b260-7fb5613ad5bc	t	2026-01-14 21:41:55.295
eb14c00a-7af9-4a01-9cde-1164ef729dc0	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	60c10db1-79f6-48e3-8274-e46c870e6738	t	2026-01-14 21:51:38.063
287aa39f-e699-4fd7-84ad-721479278261	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	71e3f1fe-e298-4aa7-8841-b8495b31edb1	t	2026-01-14 21:51:43.12
166780af-aa63-48e3-ad98-07666cac9d25	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	dfc9b8a4-b48e-46fc-9020-1a48fa38cfb6	t	2026-01-14 21:51:49.626
a3a8f4f7-1a46-450d-b318-abdb1eca0537	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	06c6fd0e-b1b7-4e54-a543-8dfa8384d060	t	2026-01-14 22:46:16.13
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questions (id, "quizId", question, options, "correctAnswer", "order") FROM stdin;
6c80b2ec-b8ed-418e-9707-4b7974f0c165	b169a85b-c0d5-4c56-acff-c8578b15b8e0	What is the MOST important step to take before clicking a link in an email?	{"Check if it looks professional","Hover over it to preview the URL","Click it to see where it goes","Forward it to a friend"}	1	1
3bde2083-e87a-422f-9111-d364966fdecd	b169a85b-c0d5-4c56-acff-c8578b15b8e0	Which type of authentication provides the BEST protection against phishing?	{"SMS codes","Security questions","Hardware security keys","Email verification"}	2	2
fd056e61-716c-4bd7-a3a2-a080c3834a5c	b169a85b-c0d5-4c56-acff-c8578b15b8e0	If you suspect you've been phished, what should you do FIRST?	{"Delete the email","Change your passwords immediately","Wait and see if anything happens","Report it to authorities"}	1	3
025f16ad-5531-4093-8da8-4e00bab2d8f0	b169a85b-c0d5-4c56-acff-c8578b15b8e0	What percentage of data breaches involve phishing attacks?	{"About 30%","About 50%","About 70%","Over 90%"}	3	4
e9db777e-79fc-496e-b0d8-57a0ceda4062	b169a85b-c0d5-4c56-acff-c8578b15b8e0	Which is a sign that an email might be a phishing attempt?	{"Sent from a known contact","Contains company logo","Creates urgency to act immediately","Has your correct name"}	2	5
92aabcd3-d2cc-4d14-92a7-c0232e6f1fa7	329e9af1-b4e8-4d6f-879a-8226bdd1309d	What is the minimum recommended password length?	{"6 characters","8 characters","12 characters","20 characters"}	2	1
d35bcd37-4ad1-4a9c-8b57-138b5ece8098	329e9af1-b4e8-4d6f-879a-8226bdd1309d	Which password is the STRONGEST?	{Password123!,MyDogAte3BluePancakesIn2024!,qwerty12345,admin@123}	1	2
b2f329de-a8d5-4320-99a8-f40c1396662f	329e9af1-b4e8-4d6f-879a-8226bdd1309d	What does MFA stand for?	{"Multiple Factor Access","Multi-Factor Authentication","Main Firewall Application","Master File Authorization"}	1	3
e7690c5d-9d50-4188-8f76-accb121eb546	329e9af1-b4e8-4d6f-879a-8226bdd1309d	Which MFA method is considered MOST secure?	{"SMS codes","Email verification","Hardware security keys","Security questions"}	2	4
0754eeda-f51e-43d7-891f-0a9d48a62a7d	329e9af1-b4e8-4d6f-879a-8226bdd1309d	What type of attack uses stolen credentials from one site to try on other sites?	{"Brute force attack","Dictionary attack","Credential stuffing",Phishing}	2	5
3e112172-efa0-4720-9719-017aa1e314ae	6eb193c6-9c2a-4b39-8e61-6004dd246903	What psychological principle do attackers exploit when creating time pressure?	{Authority,Urgency,Reciprocity,Trust}	1	1
49a65f9f-007c-40ef-a9a9-f3d661a40c11	6eb193c6-9c2a-4b39-8e61-6004dd246903	What is "tailgating" in social engineering?	{"Following someone on social media","Physically following someone into a restricted area","Sending follow-up phishing emails","Tracking someone's online activity"}	1	2
caa7281c-a66d-4f2d-88ff-0dd247c4e595	6eb193c6-9c2a-4b39-8e61-6004dd246903	If someone calls claiming to be IT support and asks for your password, you should:	{"Give it to them if they sound professional","Hang up and call IT through official channels","Ask them security questions first","Email them the password instead"}	1	3
99de9c8d-7221-4ed2-9247-cfd06c6cfa7e	6eb193c6-9c2a-4b39-8e61-6004dd246903	What is "pretexting"?	{"Sending text messages","Creating a fake scenario to extract information","Previewing email content","Testing security systems"}	1	4
382a3b5e-1ce0-4ed0-980f-eb7bc9cb6f8e	6eb193c6-9c2a-4b39-8e61-6004dd246903	What should you do if you suspect you've been targeted by social engineering?	{"Keep it to yourself","Document and report it immediately","Delete all evidence","Try to track down the attacker"}	1	5
aadee39e-c55c-49bf-b0fd-0fcb87c73ae4	81459c8e-338c-466a-9cca-d6602bc70430	What does APT stand for in cybersecurity?	{"Advanced Phishing Technique","Advanced Persistent Threat","Automated Penetration Testing","Application Protocol Transfer"}	1	1
daa6f25d-1c28-4df3-af49-99db63ece738	81459c8e-338c-466a-9cca-d6602bc70430	In the NIST Incident Response Framework, what is the correct order of phases?	{"Detection, Preparation, Containment, Recovery","Preparation, Detection & Analysis, Containment & Recovery, Post-Incident","Analysis, Response, Containment, Documentation","Identification, Response, Recovery, Prevention"}	1	2
44614276-2b28-4cb7-a7a9-163c41547cfe	81459c8e-338c-466a-9cca-d6602bc70430	What is the primary purpose of the MITRE ATT&CK framework?	{"To launch cyber attacks legally","To catalog adversary tactics and techniques based on real-world observations","To encrypt sensitive data","To manage firewall rules"}	1	3
24c481fc-d0c4-414a-b97f-5b32870179aa	81459c8e-338c-466a-9cca-d6602bc70430	When collecting digital evidence, which should be collected FIRST according to order of volatility?	{"Hard drive contents","Backup media",RAM/Memory,"Physical configuration"}	2	4
4316f8f5-955e-44ef-a6b4-3606b664e214	81459c8e-338c-466a-9cca-d6602bc70430	What is "threat hunting"?	{"Installing antivirus software","Proactively searching for threats that have evaded existing security controls","Blocking malicious IP addresses","Running penetration tests"}	1	5
afcb5930-edbd-4e98-bfad-135978a58841	81459c8e-338c-466a-9cca-d6602bc70430	Which of the following is NOT a type of Indicator of Compromise (IOC)?	{"Hash values of malicious files","Known malicious IP addresses","User satisfaction scores","Malicious domain names"}	2	6
4bd48f8e-2778-4762-837d-a751929a2e3a	81459c8e-338c-466a-9cca-d6602bc70430	What is the purpose of maintaining chain of custody in forensic investigations?	{"To speed up the investigation","To document evidence handling and prove its integrity","To delete unnecessary files","To share evidence publicly"}	1	7
\.


--
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") FROM stdin;
90567890-1b5c-4836-80a8-3d2ffc70fe5e	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	b169a85b-c0d5-4c56-acff-c8578b15b8e0	60	f	2025-12-15 17:30:00
dbeb0d96-628b-48d4-9f1f-a014d117b2fa	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	b169a85b-c0d5-4c56-acff-c8578b15b8e0	80	t	2025-12-15 18:00:00
7f640d92-b469-4c8a-84a4-17141d76c5ee	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	329e9af1-b4e8-4d6f-879a-8226bdd1309d	40	f	2025-12-19 10:00:00
5078c012-48db-42e0-9bb6-3d8afbc477f5	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	6eb193c6-9c2a-4b39-8e61-6004dd246903	40	f	2026-01-14 20:57:08.459
dbab80d6-4b18-4d01-8614-cc30b6c5414e	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	6eb193c6-9c2a-4b39-8e61-6004dd246903	60	f	2026-01-14 20:59:31.3
c5a860fe-8c09-4799-8e5e-7dec8afc90b3	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	6eb193c6-9c2a-4b39-8e61-6004dd246903	80	t	2026-01-14 21:00:07.825
00adb145-48f1-4802-a697-e115c39994b7	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	6eb193c6-9c2a-4b39-8e61-6004dd246903	80	t	2026-01-14 21:01:04.2
6ab4b0bd-fbb3-4be6-80e8-89726dbf2503	3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	6eb193c6-9c2a-4b39-8e61-6004dd246903	100	t	2026-01-14 21:01:23.114
a0eab808-5b22-4783-ae6b-d0888b71a048	0033c9bd-ee84-4cdd-8576-8591ad2e8a61	6eb193c6-9c2a-4b39-8e61-6004dd246903	40	f	2026-01-14 22:23:13.81
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizzes (id, "lessonId", title, "passingScore") FROM stdin;
b169a85b-c0d5-4c56-acff-c8578b15b8e0	4ee8c7e2-3b83-4a45-bfbe-c1f9ec311f77	Phishing Protection Quiz	70
329e9af1-b4e8-4d6f-879a-8226bdd1309d	b14c261b-dabd-4564-8458-3715dad36083	Password Security Quiz	70
6eb193c6-9c2a-4b39-8e61-6004dd246903	972de6b3-7b57-4e00-a338-dab4541cfec0	Social Engineering Defense Quiz	70
81459c8e-338c-466a-9cca-d6602bc70430	b67dca25-c889-45cb-9dc5-068b1aa32a03	Advanced Threat Analysis Quiz	75
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt") FROM stdin;
ff74748f-91f6-4725-85e5-3dfb6365db6c	admin@cyberguard.com	$2a$10$QJUZkY/EZD423Sz6SSZN/OzcbyJPdmjP2jsWXq1M1YOt6WmZPV26a	Admin	User	ADMIN	2026-01-14 20:19:11.618	2026-01-14 20:19:11.618
5c4b9d83-5601-43c9-863e-8e057d453ebf	student@example.com	$2a$10$7pT1iQKSH0EQ8I/6FjaH1uxcfAyeksw.QfyXZxKqNnCSaQIf6AUoe	John	Doe	STUDENT	2026-01-14 20:19:11.681	2026-01-14 20:19:11.681
0033c9bd-ee84-4cdd-8576-8591ad2e8a61	akeemkippins.gy@gmail.com	$2a$10$fGE1cZsxXlAjtLf.r0K/gOP5sRNm.JuTVx7Kee4mjBfhjny8bxLOy	Akeem	Kippins	STUDENT	2025-12-01 10:30:00	2026-01-14 20:30:01.997
3e5bc0ed-8a57-4b19-82d0-bdadf7067de5	alexandercharles005@gmail.com	$2a$10$gcBsWSI4L7rvCHXJQ8MXj.0QlGLCbzqkpmBViyaIoKEkYC4Wh1m0S	Joshua	Charles	STUDENT	2026-01-14 20:47:17.725	2026-01-14 20:47:17.725
\.


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: progress progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: enrollments_userId_courseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON public.enrollments USING btree ("userId", "courseId");


--
-- Name: progress_userId_lessonId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "progress_userId_lessonId_key" ON public.progress USING btree ("userId", "lessonId");


--
-- Name: quizzes_lessonId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "quizzes_lessonId_key" ON public.quizzes USING btree ("lessonId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: enrollments enrollments_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lessons lessons_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: progress progress_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT "progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: progress progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT "progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions questions_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public.quizzes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public.quizzes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT "quiz_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quizzes quizzes_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT "quizzes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Ahc2Bayg852oJtcKm9TRIooacP0PyDWHnp8K7gZZjyWHKxhWHnhCeIBzrI0QExU

