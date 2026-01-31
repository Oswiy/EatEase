<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class NoBadWords implements Rule
{
    private $badWords = [];
    private $fieldName;

    public function __construct($fieldName = 'field')
    {
        $this->fieldName = $fieldName;
        $this->loadBadWords();
    }

    private function loadBadWords()
    {
        // Load from config file if exists
        if (file_exists(config_path('badwords.php'))) {
            $this->badWords = config('badwords.words', []);
        } else {
            // Default list of offensive/profane words (can be expanded)
            $this->badWords = [
                // Explicit profanity
                'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'cunt', 'dick', 'pussy', 'cock',
                'whore', 'slut', 'nigga', 'nigger', 'fag', 'faggot',
                
                // Less severe but still inappropriate
                'damn', 'hell', 'crap', 'douche', 'douchebag',
                
                // Hate speech/offensive terms
                'retard', 'spastic', 'mong', 'gimp', 'cripple',
                
                // Sexual content
                'penis', 'vagina', 'boobs', 'tits', 'nipple', 'orgasm',
                
                // Drug/alcohol references
                'cocaine', 'heroin', 'meth', 'weed', 'marijuana', 'alcohol',
                
                // Variants with symbols/numbers
                'f*ck', 'f**k', 'sh*t', 'a$$', 'b*tch', 'n*gga',
                'fuck1ng', 'sh1t', '4ss', 'b1tch',
            ];
        }
    }

    public function passes($attribute, $value)
    {
        if (!is_string($value)) {
            return true;
        }

        $lowercaseValue = strtolower($value);
        
        // Check for exact matches
        foreach ($this->badWords as $badWord) {
            // Match whole words only (using word boundaries)
            if (preg_match('/\b' . preg_quote($badWord, '/') . '\b/i', $lowercaseValue)) {
                return false;
            }
            
            // Also check for words with spaces between letters (like "f u c k")
            $spacedWord = implode('\s*', str_split($badWord));
            if (preg_match('/' . $spacedWord . '/i', preg_replace('/\s+/', '', $lowercaseValue))) {
                return false;
            }
        }

        // Check for leetspeak variants
        $leetspeakValue = $this->convertLeetspeak($lowercaseValue);
        foreach ($this->badWords as $badWord) {
            if (strpos($leetspeakValue, $badWord) !== false) {
                return false;
            }
        }

        return true;
    }

    private function convertLeetspeak($text)
    {
        $leetspeakMap = [
            '0' => 'o', '1' => 'i', '2' => 'z', '3' => 'e', '4' => 'a',
            '5' => 's', '6' => 'b', '7' => 't', '8' => 'b', '9' => 'g',
            '@' => 'a', '$' => 's', '!' => 'i', '+' => 't', '#' => 'h',
            '|' => 'i', '3' => 'e', '0' => 'o', '€' => 'e',
        ];

        $converted = $text;
        foreach ($leetspeakMap as $leet => $normal) {
            $converted = str_replace($leet, $normal, $converted);
        }
        
        return $converted;
    }

    public function message()
    {
        return 'The ' . $this->fieldName . ' contains inappropriate language. Please remove any offensive content.';
    }
}