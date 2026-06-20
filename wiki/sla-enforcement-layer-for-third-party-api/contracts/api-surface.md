---
title: API contracts
---

# API Contracts

## ENV contracts (41)

| Role | ID | Symbol | File:Line |
|------|----|--------|-----------|
| consumer | `env::BREACH_NOTIFICATION_EMAIL` | `apps\api\src\evaluator\evaluation-job.ts::runEvaluations` | `apps\api\src\evaluator\evaluation-job.ts:194` |
| consumer | `env::CORS_ORIGIN` | `` | `apps\api\src\index.ts:17` |
| consumer | `env::EMAIL_FROM` | `apps\api\src\notifications\email.ts::sendBreachEmail` | `apps\api\src\notifications\email.ts:24` |
| consumer | `env::ETHERSCAN_API_KEY` | `` | `contracts\hardhat.config.ts:14` |
| consumer | `env::NEXT_PUBLIC_API_BASE_URL` | `` | `apps\web\src\lib\api.ts:3` |
| consumer | `env::NEXT_PUBLIC_SUPABASE_ANON_KEY` | `` | `apps\web\src\lib\supabase.ts:4` |
| consumer | `env::NEXT_PUBLIC_SUPABASE_URL` | `` | `apps\web\src\lib\supabase.ts:3` |
| consumer | `env::ORACLE_ADDRESS` | `contracts\scripts\deploy.ts::main` | `contracts\scripts\deploy.ts:9` |
| consumer | `env::ORACLE_PRIVATE_KEY` | `` | `contracts\hardhat.config.ts:10` |
| consumer | `env::ORACLE_PRIVATE_KEY` | `apps\api\src\blockchain\escrow-client.ts::getWallet` | `apps\api\src\blockchain\escrow-client.ts:17` |
| consumer | `env::PORT` | `apps\api\src\index.ts::start` | `apps\api\src\index.ts:37` |
| consumer | `env::RESEND_API_KEY` | `` | `apps\api\src\notifications\email.ts:3` |
| consumer | `env::SEPOLIA_RPC_URL` | `` | `contracts\hardhat.config.ts:9` |
| consumer | `env::SEPOLIA_RPC_URL` | `apps\api\src\blockchain\escrow-client.ts::getProvider` | `apps\api\src\blockchain\escrow-client.ts:9` |
| consumer | `env::SLA_ESCROW_CONTRACT_ADDRESS` | `apps\api\src\blockchain\escrow-client.ts::getContract` | `apps\api\src\blockchain\escrow-client.ts:31` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `` | `apps\api\src\routes\agreements.ts:8` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `` | `apps\api\src\routes\demo.ts:9` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `` | `apps\api\src\middleware\auth.ts:6` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `` | `apps\api\src\routes\providers.ts:8` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `` | `apps\api\src\db.test.ts:7` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `` | `apps\api\src\migrate.ts:11` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `` | `apps\api\src\routes\evaluations.ts:7` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `` | `apps\api\src\routes\endpoints.ts:8` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `` | `apps\api\src\routes\breaches.ts:7` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `apps\api\src\worker\probe-runner.ts::getSupabaseClient` | `apps\api\src\worker\probe-runner.ts:9` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `apps\api\src\evaluator\evaluation-job.ts::getSupabaseClient` | `apps\api\src\evaluator\evaluation-job.ts:10` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `apps\api\src\worker\scheduler.ts::getSupabaseClient` | `apps\api\src\worker\scheduler.ts:10` |
| consumer | `env::SUPABASE_SERVICE_ROLE_KEY` | `` | `apps\api\src\seed.ts:6` |
| consumer | `env::SUPABASE_URL` | `` | `apps\api\src\routes\agreements.ts:7` |
| consumer | `env::SUPABASE_URL` | `` | `apps\api\src\routes\demo.ts:8` |
| consumer | `env::SUPABASE_URL` | `` | `apps\api\src\middleware\auth.ts:5` |
| consumer | `env::SUPABASE_URL` | `` | `apps\api\src\routes\providers.ts:7` |
| consumer | `env::SUPABASE_URL` | `` | `apps\api\src\db.test.ts:6` |
| consumer | `env::SUPABASE_URL` | `` | `apps\api\src\migrate.ts:10` |
| consumer | `env::SUPABASE_URL` | `` | `apps\api\src\routes\evaluations.ts:6` |
| consumer | `env::SUPABASE_URL` | `` | `apps\api\src\routes\endpoints.ts:7` |
| consumer | `env::SUPABASE_URL` | `` | `apps\api\src\routes\breaches.ts:6` |
| consumer | `env::SUPABASE_URL` | `apps\api\src\worker\probe-runner.ts::getSupabaseClient` | `apps\api\src\worker\probe-runner.ts:8` |
| consumer | `env::SUPABASE_URL` | `apps\api\src\evaluator\evaluation-job.ts::getSupabaseClient` | `apps\api\src\evaluator\evaluation-job.ts:9` |
| consumer | `env::SUPABASE_URL` | `apps\api\src\worker\scheduler.ts::getSupabaseClient` | `apps\api\src\worker\scheduler.ts:9` |
| consumer | `env::SUPABASE_URL` | `` | `apps\api\src\seed.ts:5` |

## GRAPHQL contracts (9)

| Role | ID | Symbol | File:Line |
|------|----|--------|-----------|
| consumer | `graphql::Query::agreement_id` | `apps\api\src\routes\evaluations.ts::evaluationsRoutes` | `apps\api\src\routes\evaluations.ts:15` |
| consumer | `graphql::Query::agreement_id` | `apps\api\src\routes\breaches.ts::breachesRoutes` | `apps\api\src\routes\breaches.ts:15` |
| consumer | `graphql::Query::limit` | `apps\api\src\routes\evaluations.ts::evaluationsRoutes` | `apps\api\src\routes\evaluations.ts:15` |
| consumer | `graphql::Query::limit` | `apps\api\src\routes\breaches.ts::breachesRoutes` | `apps\api\src\routes\breaches.ts:15` |
| consumer | `graphql::Query::page` | `apps\api\src\routes\evaluations.ts::evaluationsRoutes` | `apps\api\src\routes\evaluations.ts:15` |
| consumer | `graphql::Query::page` | `apps\api\src\routes\breaches.ts::breachesRoutes` | `apps\api\src\routes\breaches.ts:15` |
| consumer | `graphql::Query::provider_id` | `apps\api\src\routes\agreements.ts::agreementsRoutes` | `apps\api\src\routes\agreements.ts:30` |
| consumer | `graphql::Query::provider_id` | `apps\api\src\routes\endpoints.ts::endpointsRoutes` | `apps\api\src\routes\endpoints.ts:28` |
| consumer | `graphql::Query::resolved` | `apps\api\src\routes\breaches.ts::breachesRoutes` | `apps\api\src\routes\breaches.ts:15` |

## GRPC contracts (1)

| Role | ID | Symbol | File:Line |
|------|----|--------|-----------|
| consumer | `grpc::API` | `apps\web\src\lib\api.ts::APIClient.createEndpoint` | `apps\web\src\lib\api.ts:95` |

## HTTP contracts (22)

| Role | ID | Symbol | File:Line |
|------|----|--------|-----------|
| consumer | `http::GET::/{p1}` | `apps\web\src\lib\api.ts::APIClient.request` | `apps\web\src\lib\api.ts:49` |
| provider | `http::DELETE::/agreements/{p1}` | `apps\api\src\routes\agreements.ts::agreementsRoutes` | `apps\api\src\routes\agreements.ts:142` |
| provider | `http::DELETE::/endpoints/{p1}` | `apps\api\src\routes\endpoints.ts::endpointsRoutes` | `apps\api\src\routes\endpoints.ts:137` |
| provider | `http::DELETE::/providers/{p1}` | `apps\api\src\routes\providers.ts::providersRoutes` | `apps\api\src\routes\providers.ts:112` |
| provider | `http::GET::/agreements` | `apps\api\src\routes\agreements.ts::agreementsRoutes` | `apps\api\src\routes\agreements.ts:27` |
| provider | `http::GET::/agreements/{p1}` | `apps\api\src\routes\agreements.ts::agreementsRoutes` | `apps\api\src\routes\agreements.ts:53` |
| provider | `http::GET::/api/healthz` | `` | `apps\api\src\index.ts:24` |
| provider | `http::GET::/breaches` | `apps\api\src\routes\breaches.ts::breachesRoutes` | `apps\api\src\routes\breaches.ts:12` |
| provider | `http::GET::/breaches/{p1}` | `apps\api\src\routes\breaches.ts::breachesRoutes` | `apps\api\src\routes\breaches.ts:59` |
| provider | `http::GET::/endpoints` | `apps\api\src\routes\endpoints.ts::endpointsRoutes` | `apps\api\src\routes\endpoints.ts:25` |
| provider | `http::GET::/endpoints/{p1}` | `apps\api\src\routes\endpoints.ts::endpointsRoutes` | `apps\api\src\routes\endpoints.ts:50` |
| provider | `http::GET::/evaluations` | `apps\api\src\routes\evaluations.ts::evaluationsRoutes` | `apps\api\src\routes\evaluations.ts:12` |
| provider | `http::GET::/evaluations/{p1}` | `apps\api\src\routes\evaluations.ts::evaluationsRoutes` | `apps\api\src\routes\evaluations.ts:54` |
| provider | `http::GET::/providers` | `apps\api\src\routes\providers.ts::providersRoutes` | `apps\api\src\routes\providers.ts:21` |
| provider | `http::GET::/providers/{p1}` | `apps\api\src\routes\providers.ts::providersRoutes` | `apps\api\src\routes\providers.ts:36` |
| provider | `http::POST::/agreements` | `apps\api\src\routes\agreements.ts::agreementsRoutes` | `apps\api\src\routes\agreements.ts:73` |
| provider | `http::POST::/endpoints` | `apps\api\src\routes\endpoints.ts::endpointsRoutes` | `apps\api\src\routes\endpoints.ts:71` |
| provider | `http::POST::/evaluate-now` | `apps\api\src\routes\demo.ts::demoRoutes` | `apps\api\src\routes\demo.ts:18` |
| provider | `http::POST::/providers` | `apps\api\src\routes\providers.ts::providersRoutes` | `apps\api\src\routes\providers.ts:56` |
| provider | `http::PUT::/agreements/{p1}` | `apps\api\src\routes\agreements.ts::agreementsRoutes` | `apps\api\src\routes\agreements.ts:113` |
| provider | `http::PUT::/endpoints/{p1}` | `apps\api\src\routes\endpoints.ts::endpointsRoutes` | `apps\api\src\routes\endpoints.ts:107` |
| provider | `http::PUT::/providers/{p1}` | `apps\api\src\routes\providers.ts::providersRoutes` | `apps\api\src\routes\providers.ts:83` |

