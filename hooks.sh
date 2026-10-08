#!/bin/bash

cd .git/hooks
if [ ! -f pre-commit ]; then
    cat << 'EOF' > pre-commit
#!/bin/sh
deno run pre-commit

EOF
chmod +x pre-commit
fi
