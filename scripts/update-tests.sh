# Add the fixed tests to the main tests directory, replacing the original failing tests

# First, let's remove the original tests that were failing
rm -f /home/daniel/projects/formBuilder/tests/unit/components/vForm.spec.ts
rm -f /home/daniel/projects/formBuilder/tests/unit/components/inputs/EmailInput.spec.ts
rm -f /home/daniel/projects/formBuilder/tests/unit/components/inputs/SelectInput.spec.ts

# Now, copy the fixed tests to the standard location
cp /home/daniel/projects/formBuilder/tests/unit/components/vForm.fixed.spec.ts /home/daniel/projects/formBuilder/tests/unit/components/vForm.spec.ts
cp /home/daniel/projects/formBuilder/tests/unit/components/inputs/EmailInput.fixed.spec.ts /home/daniel/projects/formBuilder/tests/unit/components/inputs/EmailInput.spec.ts 
cp /home/daniel/projects/formBuilder/tests/unit/components/inputs/SelectInput.fixed.spec.ts /home/daniel/projects/formBuilder/tests/unit/components/inputs/SelectInput.spec.ts

# Clean up the .fixed tests since we don't need them anymore
rm -f /home/daniel/projects/formBuilder/tests/unit/components/vForm.fixed.spec.ts
rm -f /home/daniel/projects/formBuilder/tests/unit/components/inputs/EmailInput.fixed.spec.ts
rm -f /home/daniel/projects/formBuilder/tests/unit/components/inputs/SelectInput.fixed.spec.ts
