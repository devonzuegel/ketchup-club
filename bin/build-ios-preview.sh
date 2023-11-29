echo ""
echo "--------------------------------------------------"
echo "          building iOS app"
echo "--------------------------------------------------"

echo ""
echo "⚠️  REMEMBER: TestFlight will reject builds with the same version number!"
echo ""
read -p "Have you bumped the version number? (y/n): " answer
if [ "$answer" != "y" ]; then
  exit 1
else
  echo ""
  echo "running command:"
  echo "    eas build --platform ios"
  echo ""

  eas build --platform ios
fi
