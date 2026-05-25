<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePublisherRequest;
use App\Http\Requests\UpdatePublisherRequest;
use App\Http\Resources\PublisherResource;
use App\Models\Publisher;

class PublisherController extends Controller
{
    public function index()
    {
        return PublisherResource::collection(Publisher::paginate(15));
    }

    public function store(StorePublisherRequest $request)
    {
        return new PublisherResource(Publisher::create($request->validated()));
    }

    public function show(Publisher $publisher)
    {
        return new PublisherResource($publisher);
    }

    public function update(UpdatePublisherRequest $request, Publisher $publisher)
    {
        $publisher->update($request->validated());
        return new PublisherResource($publisher);
    }

    public function destroy(Publisher $publisher)
    {
        $publisher->delete();
        return response()->noContent();
    }
}
