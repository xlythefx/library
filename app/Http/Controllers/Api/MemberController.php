<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Http\Resources\MemberResource;
use App\Models\Member;

class MemberController extends Controller
{
    public function index()
    {
        return MemberResource::collection(Member::paginate(15));
    }

    public function store(StoreMemberRequest $request)
    {
        $data = $request->validated();
        if (empty($data['membership_number'])) {
            $data['membership_number'] = 'LIB-' . str_pad((string)(Member::max('id') + 1), 6, '0', STR_PAD_LEFT);
        }
        return new MemberResource(Member::create($data));
    }

    public function show(Member $member)
    {
        return new MemberResource($member);
    }

    public function update(UpdateMemberRequest $request, Member $member)
    {
        $member->update($request->validated());
        return new MemberResource($member);
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return response()->noContent();
    }
}
