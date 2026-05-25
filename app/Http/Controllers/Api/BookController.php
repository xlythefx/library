<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;

class BookController extends Controller
{
    public function index()
    {
        return BookResource::collection(Book::with(['publisher', 'authors', 'categories'])->paginate(15));
    }

    public function store(StoreBookRequest $request)
    {
        $data = $request->validated();
        $authorIds = $data['author_ids'] ?? null;
        $categoryIds = $data['category_ids'] ?? null;
        unset($data['author_ids'], $data['category_ids']);

        $book = Book::create($data);
        if ($authorIds !== null) $book->authors()->sync($authorIds);
        if ($categoryIds !== null) $book->categories()->sync($categoryIds);

        return new BookResource($book->load(['publisher', 'authors', 'categories']));
    }

    public function show(Book $book)
    {
        return new BookResource($book->load(['publisher', 'authors', 'categories']));
    }

    public function update(UpdateBookRequest $request, Book $book)
    {
        $data = $request->validated();
        $authorIds = $data['author_ids'] ?? null;
        $categoryIds = $data['category_ids'] ?? null;
        unset($data['author_ids'], $data['category_ids']);

        $book->update($data);
        if ($authorIds !== null) $book->authors()->sync($authorIds);
        if ($categoryIds !== null) $book->categories()->sync($categoryIds);

        return new BookResource($book->load(['publisher', 'authors', 'categories']));
    }

    public function destroy(Book $book)
    {
        $book->delete();
        return response()->noContent();
    }
}
