#! /bin/bash

rest=$1
while [ -n "$rest" ] ; do
   str=${rest%%,*}  # Everything up to the first ';'
   # Trim up to the first ',' -- and handle final case, too.
   [ "$rest" = "${rest/,/}" ] && rest= || rest=${rest#*,}
   echo "+ \"$str\"" 
   npm run $str
done