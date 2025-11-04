# API Documentation

## Overview

This document provides comprehensive API documentation for {{projectName}}.

## Base URL

```
{{baseUrl}}
```

## Authentication

Describe authentication method here.

## Endpoints

### GET /api/health

Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST /api/users

Create a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

API requests are limited to 1000 requests per hour per IP address.

## SDKs

- JavaScript/Node.js
- Python
- Java
- C#

## Support

For API support, contact: {{supportEmail}}
