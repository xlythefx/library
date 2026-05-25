<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFineRequest;
use App\Http\Requests\UpdateFineRequest;
use App\Http\Resources\FineResource;
use App\Models\Fine;

class FineController extends Controller
{
    public function index()
    {
        return FineResource::collection(Fine::with(['loan', 'member'])->paginate(15));
    }

    public function store(StoreFineRequest $request)
    {
        return new FineResource(Fine::create($request->validated()));
    }

    public function show(Fine $fine)
    {
        return new FineResource($fine->load(['loan', 'member']));
    }

    public function update(UpdateFineRequest $request, Fine $fine)
    {
        $fine->update($request->validated());
        return new FineResource($fine);
    }

    public function destroy(Fine $fine)
    {
        $fine->delete();
        return response()->noContent();
    }
}
