const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import { buttonVariants } from "@/components/ui/button" if it's missing but Button is used
    if (content.includes('import { Button } from "@/components/ui/button"') && !content.includes('buttonVariants')) {
        content = content.replace('import { Button } from "@/components/ui/button"', 'import { Button, buttonVariants } from "@/components/ui/button"');
    } else if (content.includes('import { Button') && !content.includes('buttonVariants')) {
        content = content.replace('import { Button', 'import { Button, buttonVariants');
    }

    // Now replacing patterns
    // e.g. <Button asChild size="lg" className="..."><Link href="...">...</Link></Button>
    // Note: since this can be complex multiline, it's better to just write the file using regex or manually.
}
