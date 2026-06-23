# Infra Provision

An infrastructure provisioning platform that automates Docker container lifecycle management through asynchronous job processing.

The system accepts infrastructure provisioning requests through a web interface, persists resource and job data in PostgreSQL, dispatches jobs through RabbitMQ, and performs container lifecycle operations asynchronously using dedicated worker processes.

Infra Provision demonstrates how modern backend systems coordinate APIs, databases, message queues, and background workers to perform infrastructure automation reliably and asynchronously.

---

## Running Locally

### 1. Start Infrastructure

```bash
docker compose up -d
```

### 2. Start API

```bash
cd api
pnpm install
pnpm dev
```

### 3. Start Worker

```bash
cd api
pnpm worker
```

### 4. Start Frontend

```bash
cd web
pnpm install
pnpm dev
```

---

### Core Capabilities

* Provision Docker containers from predefined resource templates
* Asynchronous job execution using RabbitMQ
* Background worker architecture
* Retry-aware job processing
* Idempotent resource provisioning and deletion workflows
* Complete resource lifecycle management from provisioning to deletion
* Job tracking and monitoring
* Infrastructure health monitoring
* Docker Compose local development environment

---

## Architecture

```mermaid
flowchart LR

UI[React UI]
--> API[Express REST API]

API
-- Create Resources & Jobs --> DB[(PostgreSQL)]

API
-- Publish Job --> MQ[RabbitMQ]

MQ
-- Deliver Job --> Worker[Worker Service]

Worker
-- Read & Update State --> DB

Worker
-- Create/Delete Container --> Docker[Docker Engine]

Docker
--> Container[Provisioned Resource]
```

### Components

| Component           | Responsibility                       |
| ------------------- | ------------------------------------ |
| React UI            | Resource creation and monitoring     |
| Express REST API    | Request validation and orchestration |
| PostgreSQL          | Persistent resource and job storage  |
| RabbitMQ            | Asynchronous job queue               |
| Worker Service      | Background job execution             |
| Docker Engine       | Container provisioning and deletion  |

---

## REST API

The Express API acts as the orchestration layer between the frontend, PostgreSQL, and RabbitMQ.

### Resource Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/resources` | Create a resource |
| DELETE | `/resources/:id` | Delete a resource |
| GET | `/resources` | List resources |

### Job Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/jobs` | List jobs |

### Health Endpoint

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Check infrastructure health |

---

## Provisioning Workflow

```mermaid
sequenceDiagram

participant User
participant API
participant DB
participant RabbitMQ
participant Worker
participant Docker

User->>API: Create Resource

API->>DB: Save Resource
API->>DB: Create Job

API->>RabbitMQ: Publish Job

RabbitMQ->>Worker: Deliver Message

Worker->>Docker: Create Container

alt Success
    Worker->>DB: Update Resource Status
    Worker->>DB: Mark Job Complete
    Worker->>RabbitMQ: ACK Message
else Failure
    Worker->>DB: Increment Attempt Count

    alt Retry Limit Not Reached
        Worker->>DB: Set Job Status To PENDING
        Worker->>RabbitMQ: Publish New Job Message
        Worker->>RabbitMQ: ACK Original Message
    else Retry Limit Reached
        Worker->>DB: Mark Job Failed
        Worker->>RabbitMQ: ACK Message
    end
end
```

### Provision Resource

1. User submits a provisioning request.
2. API validates the request.
3. Resource metadata is persisted.
4. A provisioning job is created.
5. The job is published to RabbitMQ.
6. A worker consumes the message.
7. Docker provisions the container.
8. Resource and job status are updated.

---

## Deletion Workflow

```mermaid
sequenceDiagram

participant User
participant API
participant DB
participant RabbitMQ
participant Worker
participant Docker

User->>API: Delete Resource

API->>DB: Create Delete Job
API->>RabbitMQ: Publish Job

RabbitMQ->>Worker: Deliver Message

Worker->>DB: Load Resource

alt Resource Not Found
    Worker->>DB: Mark Job Failed

else Resource Already Deleted
    Worker->>DB: Mark Job Done

else Resource Exists

    Worker->>Docker: Inspect Container

    alt Container Missing
        Worker->>DB: Mark Resource Deleted
        Worker->>DB: Mark Job Done

    else Container Exists
        Worker->>Docker: Stop Container
        Worker->>Docker: Remove Container

        Worker->>DB: Mark Resource Deleted
        Worker->>DB: Mark Job Done
    end
end

opt Unexpected Error
    Worker->>DB: Mark Job Failed
    Worker->>DB: Increment Attempt Count
    Worker->>RabbitMQ: Publish New Job Message
end
```

### Delete Resource

1. User requests resource deletion.
2. API creates a deletion job.
3. Job is published to RabbitMQ.
4. Worker consumes the message.
5. Docker removes the container.
6. Resource and job status are updated.

---

## Technology Stack

### Backend

* TypeScript
* Node.js
* Express
* PostgreSQL
* RabbitMQ
* Dockerode

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Infrastructure

* Docker
* Docker Compose

---


## Resource Lifecycle

| State          | Description                        |
| -------------- | ---------------------------------- |
| `PROVISIONING` | Container creation in progress     |
| `PROVISIONED`  | Container successfully provisioned |
| `DELETING`     | Container removal in progress      |
| `DELETED`      | Resource removed                   |

---

### Job States

| State        | Description                                 |
| ------------ | ------------------------------------------- |
| `PENDING`    | Waiting in queue                            |
| `PROCESSING` | Being executed by worker                    |
| `DONE`       | Successfully completed                      |
| `FAILED`     | Retry limit exceeded or unrecoverable error |

---

## Health Monitoring

The platform exposes a health endpoint that verifies:

* PostgreSQL connectivity
* RabbitMQ connectivity
* Docker Engine connectivity

Example response:

```json
{
  "status":   "ok",
  "database": "up",
  "rabbitmq": "up",
  "docker":   "up"
}
```

---


## Screenshots

### Dashboard

![Dashboard](./docs/screenshots/home.png)

### Resources

![Resources](./docs/screenshots/resources.png)

### Jobs

![Jobs](./docs/screenshots/jobs.png)

### Health Monitoring

![Health](./docs/screenshots/health.png)

*Add screenshot*

---

## W.I.P

- [ ] WebSocket-based real-time updates
- [ ] Benchmarks
- [ ] Retries for failed jobs
- [ ] OpenAPI integration
- [ ] CI/CD
- [ ] Tests
