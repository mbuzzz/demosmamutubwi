<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TemplateCbt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CbtTemplateController extends Controller
{
    public function index()
    {
        $templates = TemplateCbt::with('creator:id,name')
            ->latest()
            ->get();
        return response()->json(['data' => $templates]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'layout' => 'required|in:standar,compact,wide',
            'primary_color' => 'nullable|string|max:7',
            'accent_color' => 'nullable|string|max:7',
            'bg_color' => 'nullable|string|max:7',
            'text_color' => 'nullable|string|max:7',
            'card_bg' => 'nullable|string|max:7',
            'font_size' => 'nullable|integer|min:12|max:24',
            'font_family' => 'nullable|string|max:100',
            'header_logo' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'header_text' => 'nullable|string',
            'footer_text' => 'nullable|string',
            'show_timer' => 'boolean',
            'show_progress' => 'boolean',
            'show_question_nav' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['created_by'] = $request->user()->id;

        // Cast boolean values since form data sends them as strings
        $data['show_timer'] = $request->boolean('show_timer', true);
        $data['show_progress'] = $request->boolean('show_progress', true);
        $data['show_question_nav'] = $request->boolean('show_question_nav', true);

        if ($request->hasFile('header_logo')) {
            $path = $request->file('header_logo')->store('cbt-templates', 'public');
            $data['header_logo'] = '/storage/' . $path;
        }

        $template = TemplateCbt::create($data);

        return response()->json([
            'message' => 'Template berhasil dibuat',
            'data' => $template
        ], 201);
    }

    public function show(TemplateCbt $template)
    {
        return response()->json(['data' => $template->load('creator:id,name')]);
    }

    public function update(Request $request, TemplateCbt $template)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|string|max:255',
            'layout' => 'sometimes|in:standar,compact,wide',
            'primary_color' => 'nullable|string|max:7',
            'accent_color' => 'nullable|string|max:7',
            'bg_color' => 'nullable|string|max:7',
            'text_color' => 'nullable|string|max:7',
            'card_bg' => 'nullable|string|max:7',
            'font_size' => 'nullable|integer|min:12|max:24',
            'font_family' => 'nullable|string|max:100',
            'header_logo' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'header_text' => 'nullable|string',
            'footer_text' => 'nullable|string',
            'show_timer' => 'boolean',
            'show_progress' => 'boolean',
            'show_question_nav' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        // Handle method spoofing if needed
        if ($request->has('show_timer')) $data['show_timer'] = $request->boolean('show_timer');
        if ($request->has('show_progress')) $data['show_progress'] = $request->boolean('show_progress');
        if ($request->has('show_question_nav')) $data['show_question_nav'] = $request->boolean('show_question_nav');

        if ($request->hasFile('header_logo')) {
            if ($template->header_logo) {
                $oldPath = str_replace('/storage/', '', $template->header_logo);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('header_logo')->store('cbt-templates', 'public');
            $data['header_logo'] = '/storage/' . $path;
        }

        $template->update($data);

        return response()->json([
            'message' => 'Template berhasil diupdate',
            'data' => $template
        ]);
    }

    public function destroy(TemplateCbt $template)
    {
        if ($template->header_logo) {
            $path = str_replace('/storage/', '', $template->header_logo);
            Storage::disk('public')->delete($path);
        }
        $template->delete();
        return response()->json(['message' => 'Template berhasil dihapus']);
    }
}
