<?php

namespace App\Http\Controllers;

use App\Http\Requests\ParseMatchLogRequest;
use App\Http\Services\CsgoLogParserService;

class MatchAnalyticController extends Controller
{
    protected CsgoLogParserService $parserService;
    public function __construct(CsgoLogParserService $parserService)
    {
        $this->parserService = $parserService;
    }
    public function parseMatchLog(ParseMatchLogRequest $request)
    {
        try {
            $file = $request->file('logFile');

            // If no file is uploaded, use a sample log file from public directory
            $content = $file
                ? file_get_contents($file->getRealPath())
                : file_get_contents(public_path('sample-match-log.txt'));

            $analytics = $this->parserService->parse($content);

            return redirect()->back()->with([
                'success' => true,
                'message' => 'Log file parsed successfully.',
                'match_analytics' => $analytics,
            ]);
        } catch (\Exception $e) {
            redirect()->back()->with([
                'success' => false,
                'message' => 'Error parsing log file: ' . $e->getMessage()
            ]);
        }
    }
}
