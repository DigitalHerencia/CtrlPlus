# Unnamed CodeViz Diagram

```mermaid
graph TD

    base.cv::end_user["**End User**<br>[External]"]
    base.cv::clerk["**Clerk**<br>package.json `"@clerk/nextjs"`, lib/integrations/clerk.ts `clerkClient`"]
    base.cv::stripe["**Stripe**<br>package.json `"stripe"`, lib/integrations/stripe.ts `stripe`"]
    base.cv::cloudinary["**Cloudinary**<br>package.json `"cloudinary"`, lib/integrations/cloudinary.ts `uploadImageToCloudinary`"]
    base.cv::vercel_blob["**Vercel Blob Storage**<br>package.json `"@vercel/blob"`, lib/integrations/blob.ts `put`"]
    base.cv::huggingface["**Hugging Face Inference API**<br>package.json `"@huggingface/inference"`, lib/integrations/huggingface.ts `HuggingFaceInference`"]
    subgraph base.cv::ctrlplus_app["**CtrlPlus Application**<br>[External]"]
        subgraph base.cv::ctrlplus_app_nextjs_server["**Next.js Server**<br>package.json `"name": "ctrl-plus"`, package.json `"start": "next start"`, next.config.ts `/** @type {import('next').NextConfig} */`"]
            base.cv::ctrlplus_app_nextjs_server_clerk_api["**Clerk Webhook/API**<br>app/api/clerk/"]
            base.cv::ctrlplus_app_nextjs_server_health_api["**Health API**<br>app/api/health/"]
            base.cv::ctrlplus_app_nextjs_server_stripe_api["**Stripe API**<br>app/api/stripe/"]
            base.cv::ctrlplus_app_nextjs_server_visualizer_api["**Visualizer API**<br>app/api/visualizer/"]
            base.cv::ctrlplus_app_nextjs_server_actions["**Server Actions**<br>lib/actions/"]
            base.cv::ctrlplus_app_nextjs_server_auth_service["**Auth Service**<br>lib/auth/"]
            base.cv::ctrlplus_app_nextjs_server_db_access["**Database Access Layer**<br>lib/db/"]
            base.cv::ctrlplus_app_nextjs_server_integrations_manager["**Integrations Manager**<br>lib/integrations/"]
            base.cv::ctrlplus_app_nextjs_server_visualizer_logic["**Visualizer Logic**<br>lib/visualizer/"]
            base.cv::ctrlplus_app_nextjs_server_visualizer_fetchers["**Visualizer Fetchers**<br>lib/fetchers/visualizer.fetchers.ts `getPreviewById`"]
            %% Edges at this level (grouped by source)
            base.cv::ctrlplus_app_nextjs_server_clerk_api["**Clerk Webhook/API**<br>app/api/clerk/"] -->|"Uses"| base.cv::ctrlplus_app_nextjs_server_auth_service["**Auth Service**<br>lib/auth/"]
            base.cv::ctrlplus_app_nextjs_server_stripe_api["**Stripe API**<br>app/api/stripe/"] -->|"Updates order status in"| base.cv::ctrlplus_app_nextjs_server_db_access["**Database Access Layer**<br>lib/db/"]
            base.cv::ctrlplus_app_nextjs_server_stripe_api["**Stripe API**<br>app/api/stripe/"] -->|"Processes payments via Stripe API"| base.cv::ctrlplus_app_nextjs_server_integrations_manager["**Integrations Manager**<br>lib/integrations/"]
            base.cv::ctrlplus_app_nextjs_server_visualizer_api["**Visualizer API**<br>app/api/visualizer/"] -->|"Fetches data using"| base.cv::ctrlplus_app_nextjs_server_visualizer_fetchers["**Visualizer Fetchers**<br>lib/fetchers/visualizer.fetchers.ts `getPreviewById`"]
            base.cv::ctrlplus_app_nextjs_server_actions["**Server Actions**<br>lib/actions/"] -->|"Uses"| base.cv::ctrlplus_app_nextjs_server_auth_service["**Auth Service**<br>lib/auth/"]
            base.cv::ctrlplus_app_nextjs_server_actions["**Server Actions**<br>lib/actions/"] -->|"Interacts with"| base.cv::ctrlplus_app_nextjs_server_db_access["**Database Access Layer**<br>lib/db/"]
            base.cv::ctrlplus_app_nextjs_server_actions["**Server Actions**<br>lib/actions/"] -->|"Uses external services via"| base.cv::ctrlplus_app_nextjs_server_integrations_manager["**Integrations Manager**<br>lib/integrations/"]
            base.cv::ctrlplus_app_nextjs_server_auth_service["**Auth Service**<br>lib/auth/"] -->|"Stores user data in"| base.cv::ctrlplus_app_nextjs_server_db_access["**Database Access Layer**<br>lib/db/"]
            base.cv::ctrlplus_app_nextjs_server_visualizer_fetchers["**Visualizer Fetchers**<br>lib/fetchers/visualizer.fetchers.ts `getPreviewById`"] -->|"Retrieves session via"| base.cv::ctrlplus_app_nextjs_server_auth_service["**Auth Service**<br>lib/auth/"]
            base.cv::ctrlplus_app_nextjs_server_visualizer_fetchers["**Visualizer Fetchers**<br>lib/fetchers/visualizer.fetchers.ts `getPreviewById`"] -->|"Queries previews from"| base.cv::ctrlplus_app_nextjs_server_db_access["**Database Access Layer**<br>lib/db/"]
            base.cv::ctrlplus_app_nextjs_server_visualizer_logic["**Visualizer Logic**<br>lib/visualizer/"] -->|"Calls Hugging Face via"| base.cv::ctrlplus_app_nextjs_server_integrations_manager["**Integrations Manager**<br>lib/integrations/"]
        end
        subgraph base.cv::ctrlplus_app_nextjs_client["**Next.js Client**<br>app/layout.tsx `metadata`, app/page.tsx `"use client"`"]
            base.cv::ctrlplus_app_nextjs_client_main_ui["**Main UI**<br>app/layout.tsx `RootLayout`, app/page.tsx `HomePage`"]
            base.cv::ctrlplus_app_nextjs_client_ui_components["**Client UI Components**<br>components/"]
            base.cv::ctrlplus_app_nextjs_client_logic_hooks["**Client-side Logic/Hooks**<br>hooks/"]
            base.cv::ctrlplus_app_nextjs_client_data_fetching["**Client Data Fetching**<br>lib/fetchers/"]
            %% Edges at this level (grouped by source)
            base.cv::ctrlplus_app_nextjs_client_main_ui["**Main UI**<br>app/layout.tsx `RootLayout`, app/page.tsx `HomePage`"] -->|"Composes UI using"| base.cv::ctrlplus_app_nextjs_client_ui_components["**Client UI Components**<br>components/"]
            base.cv::ctrlplus_app_nextjs_client_main_ui["**Main UI**<br>app/layout.tsx `RootLayout`, app/page.tsx `HomePage`"] -->|"Uses client-side logic from"| base.cv::ctrlplus_app_nextjs_client_logic_hooks["**Client-side Logic/Hooks**<br>hooks/"]
            base.cv::ctrlplus_app_nextjs_client_main_ui["**Main UI**<br>app/layout.tsx `RootLayout`, app/page.tsx `HomePage`"] -->|"Fetches data via"| base.cv::ctrlplus_app_nextjs_client_data_fetching["**Client Data Fetching**<br>lib/fetchers/"]
            base.cv::ctrlplus_app_nextjs_client_ui_components["**Client UI Components**<br>components/"] -->|"Uses client-side logic from"| base.cv::ctrlplus_app_nextjs_client_logic_hooks["**Client-side Logic/Hooks**<br>hooks/"]
            base.cv::ctrlplus_app_nextjs_client_ui_components["**Client UI Components**<br>components/"] -->|"Fetches data via"| base.cv::ctrlplus_app_nextjs_client_data_fetching["**Client Data Fetching**<br>lib/fetchers/"]
            base.cv::ctrlplus_app_nextjs_client_logic_hooks["**Client-side Logic/Hooks**<br>hooks/"] -->|"Initiates data fetching with"| base.cv::ctrlplus_app_nextjs_client_data_fetching["**Client Data Fetching**<br>lib/fetchers/"]
        end
        %% Edges at this level (grouped by source)
        base.cv::ctrlplus_app_nextjs_client["**Next.js Client**<br>app/layout.tsx `metadata`, app/page.tsx `"use client"`"] -->|"Makes API calls to"| base.cv::ctrlplus_app_nextjs_server["**Next.js Server**<br>package.json `"name": "ctrl-plus"`, package.json `"start": "next start"`, next.config.ts `/** @type {import('next').NextConfig} */`"]
    end
    subgraph base.cv::database["**Database**<br>prisma/schema.prisma `datasource db`, package.json `"@neondatabase/serverless"`, package.json `"@prisma/client"`"]
        subgraph base.cv::database_postgresql["**PostgreSQL Database**<br>prisma/schema.prisma `provider = "postgresql"`, package.json `"@neondatabase/serverless"`"]
            base.cv::database_postgresql_data_storage["**Data Storage**<br>prisma/schema.prisma `model`"]
        end
    end
    %% Edges at this level (grouped by source)
    base.cv::end_user["**End User**<br>[External]"] -->|"Uses"| base.cv::ctrlplus_app_nextjs_client["**Next.js Client**<br>app/layout.tsx `metadata`, app/page.tsx `"use client"`"]
    base.cv::ctrlplus_app_nextjs_server["**Next.js Server**<br>package.json `"name": "ctrl-plus"`, package.json `"start": "next start"`, next.config.ts `/** @type {import('next').NextConfig} */`"] -->|"Authenticates users with"| base.cv::clerk["**Clerk**<br>package.json `"@clerk/nextjs"`, lib/integrations/clerk.ts `clerkClient`"]
    base.cv::ctrlplus_app_nextjs_server["**Next.js Server**<br>package.json `"name": "ctrl-plus"`, package.json `"start": "next start"`, next.config.ts `/** @type {import('next').NextConfig} */`"] -->|"Processes payments via"| base.cv::stripe["**Stripe**<br>package.json `"stripe"`, lib/integrations/stripe.ts `stripe`"]
    base.cv::ctrlplus_app_nextjs_server["**Next.js Server**<br>package.json `"name": "ctrl-plus"`, package.json `"start": "next start"`, next.config.ts `/** @type {import('next').NextConfig} */`"] -->|"Manages images with"| base.cv::cloudinary["**Cloudinary**<br>package.json `"cloudinary"`, lib/integrations/cloudinary.ts `uploadImageToCloudinary`"]
    base.cv::ctrlplus_app_nextjs_server["**Next.js Server**<br>package.json `"name": "ctrl-plus"`, package.json `"start": "next start"`, next.config.ts `/** @type {import('next').NextConfig} */`"] -->|"Stores files in"| base.cv::vercel_blob["**Vercel Blob Storage**<br>package.json `"@vercel/blob"`, lib/integrations/blob.ts `put`"]
    base.cv::ctrlplus_app_nextjs_server["**Next.js Server**<br>package.json `"name": "ctrl-plus"`, package.json `"start": "next start"`, next.config.ts `/** @type {import('next').NextConfig} */`"] -->|"Performs AI inference for visualizer via"| base.cv::huggingface["**Hugging Face Inference API**<br>package.json `"@huggingface/inference"`, lib/integrations/huggingface.ts `HuggingFaceInference`"]
    base.cv::ctrlplus_app_nextjs_server["**Next.js Server**<br>package.json `"name": "ctrl-plus"`, package.json `"start": "next start"`, next.config.ts `/** @type {import('next').NextConfig} */`"] -->|"Reads from and writes to"| base.cv::database["**Database**<br>prisma/schema.prisma `datasource db`, package.json `"@neondatabase/serverless"`, package.json `"@prisma/client"`"]
    base.cv::ctrlplus_app_nextjs_server_clerk_api["**Clerk Webhook/API**<br>app/api/clerk/"] -->|"Authenticates users with"| base.cv::clerk["**Clerk**<br>package.json `"@clerk/nextjs"`, lib/integrations/clerk.ts `clerkClient`"]
    base.cv::ctrlplus_app_nextjs_server_stripe_api["**Stripe API**<br>app/api/stripe/"] -->|"Processes payments via"| base.cv::stripe["**Stripe**<br>package.json `"stripe"`, lib/integrations/stripe.ts `stripe`"]
    base.cv::ctrlplus_app_nextjs_server_integrations_manager["**Integrations Manager**<br>lib/integrations/"] -->|"Manages images with"| base.cv::cloudinary["**Cloudinary**<br>package.json `"cloudinary"`, lib/integrations/cloudinary.ts `uploadImageToCloudinary`"]
    base.cv::ctrlplus_app_nextjs_server_integrations_manager["**Integrations Manager**<br>lib/integrations/"] -->|"Stores files in"| base.cv::vercel_blob["**Vercel Blob Storage**<br>package.json `"@vercel/blob"`, lib/integrations/blob.ts `put`"]
    base.cv::ctrlplus_app_nextjs_server_integrations_manager["**Integrations Manager**<br>lib/integrations/"] -->|"Performs AI inference for visualizer via"| base.cv::huggingface["**Hugging Face Inference API**<br>package.json `"@huggingface/inference"`, lib/integrations/huggingface.ts `HuggingFaceInference`"]
    base.cv::ctrlplus_app_nextjs_server_db_access["**Database Access Layer**<br>lib/db/"] -->|"Reads from and writes to"| base.cv::database_postgresql_data_storage["**Data Storage**<br>prisma/schema.prisma `model`"]

```
---
*Generated by [CodeViz.ai](https://codeviz.ai) on 4/4/2026, 2:33:03 AM*
