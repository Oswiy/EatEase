<?php

namespace App\Helpers;

class BadWordFilter
{
    private static $badWords = [];
    private static $initialized = false;

    private static function initialize()
    {
        if (!self::$initialized) {
            if (file_exists(config_path('badwords.php'))) {
                self::$badWords = config('badwords.words', []);
            } else {
                // Fallback default list
                self::$badWords = [
                    'fuck',
                    'shit',
                    'asshole',
                    'bitch',
                    'bastard',
                    'cunt',
                    'dick',
                    'pussy',
                    'whore',
                    'slut',
                    'nigga',
                    'nigger',
                    'fag',
                    'faggot',
                    'damn',
                    'hell',
                    'tanga',
                    'puke',
                    'tite',
                    'tubol',
                    'tarantado',
                    'kupal',
                    'pepe',
                    'burat',
                    'tarub',
                    'bakla',
                    'tangina',
                    'tarub',
                    'etits',
                    'iyot',
                    'pota',
                    'puta',
                ];
            }
            self::$initialized = true;
        }
    }

    public static function filter($text, $replaceWith = '***')
    {
        self::initialize();

        if (!is_string($text) || empty($text)) {
            return $text;
        }

        // Create pattern - match whole words only
        $pattern = '/\b(' . implode('|', array_map('preg_quote', self::$badWords)) . ')\b/i';

        $filtered = preg_replace_callback($pattern, function ($matches) use ($replaceWith) {
            return str_repeat($replaceWith, strlen($matches[1]));
        }, $text);

        return $filtered;
    }

    public static function containsBadWords($text)
    {
        self::initialize();

        if (!is_string($text) || empty($text)) {
            return false;
        }

        // Simple check first (faster)
        $lowerText = strtolower($text);
        foreach (self::$badWords as $badWord) {
            if (strpos($lowerText, $badWord) !== false) {
                // Double check with word boundaries to avoid false positives
                if (preg_match('/\b' . preg_quote($badWord, '/') . '\b/i', $text)) {
                    return true;
                }
            }
        }

        return false;
    }

    public static function sanitize($text)
    {
        return self::filter($text);
    }

    // Helper method for debugging
    public static function getBadWords()
    {
        self::initialize();
        return self::$badWords;
    }
}