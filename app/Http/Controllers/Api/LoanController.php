<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Http\Resources\LoanResource;
use App\Models\Loan;

class LoanController extends Controller
{
    public function index()
    {
        return LoanResource::collection(Loan::with(['book', 'member', 'issuer'])->paginate(15));
    }

    public function store(StoreLoanRequest $request)
    {
        return new LoanResource(Loan::create($request->validated()));
    }

    public function show(Loan $loan)
    {
        return new LoanResource($loan->load(['book', 'member', 'issuer', 'fine']));
    }

    public function update(UpdateLoanRequest $request, Loan $loan)
    {
        $loan->update($request->validated());
        return new LoanResource($loan);
    }

    public function destroy(Loan $loan)
    {
        $loan->delete();
        return response()->noContent();
    }
}
