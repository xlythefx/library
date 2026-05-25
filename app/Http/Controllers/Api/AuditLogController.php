<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    public function index()
    {
        return AuditLogResource::collection(AuditLog::with('user')->latest('created_at')->paginate(15));
    }

    public function show(AuditLog $auditLog)
    {
        return new AuditLogResource($auditLog->load('user'));
    }
}
