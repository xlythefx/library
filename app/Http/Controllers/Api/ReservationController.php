<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;

class ReservationController extends Controller
{
    public function index()
    {
        return ReservationResource::collection(Reservation::with(['book', 'member'])->paginate(15));
    }

    public function store(StoreReservationRequest $request)
    {
        $data = $request->validated();
        $data['reserved_at'] ??= now();
        return new ReservationResource(Reservation::create($data));
    }

    public function show(Reservation $reservation)
    {
        return new ReservationResource($reservation->load(['book', 'member']));
    }

    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {
        $reservation->update($request->validated());
        return new ReservationResource($reservation);
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->noContent();
    }
}
